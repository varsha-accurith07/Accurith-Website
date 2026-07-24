// Abuse protection primitives used by both submission routes.
//
// Contents:
//   - clientIp(request): pulls the real client IP from Cloudflare's
//     CF-Connecting-IP header (or X-Forwarded-For as fallback).
//   - hashIp(ip): a SHA-256 hex digest so we never log a raw IP alongside
//     a person's name/email — cheap pseudonymisation for the rate-limit key
//     and any diagnostic logs.
//   - checkRateLimit({ ip, bucket, ... }): sliding-window counter kept in
//     a Map inside the Node process.
//
// About the in-memory limiter:
//
// Railway runs ONE long-lived Node process, so a Map persists between
// requests and this is fine for a five-enquiries-a-week prototype.
// TWO IMPORTANT CAVEATS you should not forget:
//
//   1. It RESETS ON DEPLOY. Whenever we push, everyone's counter goes back
//      to zero. Not a real risk at our volume.
//   2. It DOES NOT SURVIVE HORIZONTAL SCALING. If Railway ever runs two
//      replicas, each replica has its own Map and an attacker gets 2x the
//      quota, spread across sticky-session boundaries. If we scale, move
//      this to Redis (Upstash) or a database-backed limiter.

import { createHash } from 'node:crypto';

export function clientIp(req: Request): string {
  const cf = req.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return 'unknown';
}

export function hashIp(ip: string): string {
  // Truncated to 12 hex chars — plenty of entropy for a rate-limit key,
  // useless for correlating a person across log lines.
  return createHash('sha256').update(ip).digest('hex').slice(0, 12);
}

interface Bucket {
  windowStart: number;
  count: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  ip: string;
  bucket: string; // separates buckets per endpoint (e.g. "consultation", "apply")
  windowMs: number; // sliding window length
  max: number; // max hits per window
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number; // 0 when ok
}

export function checkRateLimit({ ip, bucket, windowMs, max }: RateLimitOptions): RateLimitResult {
  const key = `${bucket}:${hashIp(ip)}`;
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now - existing.windowStart >= windowMs) {
    buckets.set(key, { windowStart: now, count: 1 });
    return { ok: true, remaining: max - 1, retryAfterSec: 0 };
  }

  if (existing.count >= max) {
    const retryAfterSec = Math.ceil((existing.windowStart + windowMs - now) / 1000);
    return { ok: false, remaining: 0, retryAfterSec };
  }

  existing.count += 1;
  return { ok: true, remaining: max - existing.count, retryAfterSec: 0 };
}

// Cheap periodic sweep so the Map does not accumulate forever. Runs on every
// call — O(n) but n is tiny at our scale. windowMs MUST match the rate-limit
// window used by the caller; otherwise a bucket can be deleted before its
// limit window has actually elapsed, silently raising the effective limit.
export function pruneExpiredBuckets(windowMs: number, now = Date.now()): void {
  for (const [k, v] of buckets) {
    if (now - v.windowStart >= windowMs) buckets.delete(k);
  }
}

// Hard cap on request body. Rejects laughable payloads before JSON parsing.
export const MAX_BODY_BYTES = 32 * 1024;

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import PostShell from '@/components/blog/PostShell';
import { getPost } from '@/components/blog/blogData';
import { getAllSlugs, getPostBySlug } from '@/lib/blog';

// One route for every post in /content/blog. Prose styling comes from
// PostShell's [&_h2] / [&_strong] rules, so MDX output needs no extra
// component map.

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const card = getPost(slug);
  if (!post || !card) notFound();

  return (
    <PostShell post={card}>
      <MDXRemote source={post.source} />
    </PostShell>
  );
}

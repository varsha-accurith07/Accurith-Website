// Mock of POST /api/contact — the real endpoint is a Cloudflare Pages
// Function on Srujana's track (Zoho CRM lead + email alert). This keeps the
// agreed contract so the swap is a one-line change at integration (J01):
//   request  JSON: { name, email, company, role, service, message }
//   response JSON: { success: boolean }

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  role: string;
  service: string;
  message: string;
};

export type ContactResponse = { success: boolean };

// Dev toggle — flip to true (or append ?fail to the URL) to demo the error state.
export const FORCE_CONTACT_FAILURE = false;

export async function submitContact(
  payload: ContactPayload,
): Promise<ContactResponse> {
  // Simulate network latency (~800ms), matching a realistic API round trip.
  await new Promise((resolve) => setTimeout(resolve, 800));

  const forceFail =
    FORCE_CONTACT_FAILURE ||
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("fail"));

  // The payload is intentionally unused in the mock; it is what the real
  // endpoint will receive verbatim.
  void payload;

  return { success: !forceFail };
}

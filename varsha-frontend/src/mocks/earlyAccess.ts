// Mock of the Products early-access endpoint (real one lands with Srujana's
// track). Same conventions as src/mocks/contact.ts.

export type EarlyAccessPayload = {
  name: string;
  email: string;
  product: string;
};

export type EarlyAccessResponse = { success: boolean };

export const FORCE_EARLY_ACCESS_FAILURE = false;

export async function submitEarlyAccess(
  payload: EarlyAccessPayload,
): Promise<EarlyAccessResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const forceFail =
    FORCE_EARLY_ACCESS_FAILURE ||
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("fail"));

  void payload;

  return { success: !forceFail };
}

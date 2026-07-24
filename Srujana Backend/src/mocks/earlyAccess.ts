// Mock of the Products early-access endpoint — the last form still without a
// real handler. The consultation and careers forms now POST to live routes;
// this one needs an endpoint before Products can launch.

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

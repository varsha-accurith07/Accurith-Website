import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Cookie Policy (Draft)",
  robots: { index: false },
};

export default function CookiesPage() {
  return (
    <LegalPageShell
      title="Cookie Policy"
      paragraphs={[
        "This policy will list the cookies and similar technologies this site uses — deliberately few, as we run privacy-first analytics and minimal third-party code.",
        "It will explain the purpose and lifetime of each cookie, and how consent is requested and withdrawn.",
        "The cookie-consent mechanism itself is implemented separately and will be documented here once final.",
      ]}
    />
  );
}

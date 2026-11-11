import { SiteFooter } from "@/components/layout";
import { SiteHeader } from "@/components/layout";
import { WhatsAppButton } from "@/components/layout";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}

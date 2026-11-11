import type { Metadata } from "next";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Panel administrativo",
  robots: { index: false, follow: false },
};

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell configured={isSupabaseConfigured}>{children}</AdminShell>
  );
}

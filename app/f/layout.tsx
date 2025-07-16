"use client";

import Footer from "@/components/custom/footer";
import { usePathname } from "next/navigation";

export default function DiagnosticFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFooter = pathname.includes("/f/diagnostic-test/");

  return (
    <div className="flex flex-col justify-between h-screen">
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

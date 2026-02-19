import type { Metadata } from "next";
import "./globals.css";
import { LayoutWithTranslations } from "@/components/LayoutWithTranslations";

export const metadata: Metadata = {
  title: "Pre-Intermediate Games",
  description: "Short English lesson games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen text-slate-800">
        <LayoutWithTranslations>{children}</LayoutWithTranslations>
      </body>
    </html>
  );
}

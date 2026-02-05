import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HomeDoc - Intelligent Home Triage",
  description: "Privacy-first AI health assistant for emergency triage and home care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          "h-full bg-background font-sans text-foreground antialiased",
          jakarta.variable
        )}
      >
        <main className="flex min-h-screen flex-col items-center justify-between">
          {children}
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

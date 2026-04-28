import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KEISANKI - Server Dashboard",
  description: "Real-time monitoring and control dashboard for physical computation servers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-[var(--color-background)]`}>
        <Sidebar />
        <main className="flex-1 h-full overflow-y-auto p-8">
          {children}
        </main>
      </body>
    </html>
  );
}

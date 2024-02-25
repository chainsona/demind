import type { Metadata } from "next";
import { Quattrocento } from "next/font/google";
import "./globals.css";

import UiLayout from "@/components/UiLayout";

const quattrocento = Quattrocento({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "DeMind - Decentralized AI Agents",
  description:
    "Unleash the potential of your mind with our decentralized marketplace for specilized AI agents. Explore, create, and trade unique DeMinds tailored to your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={quattrocento.className}>
        <UiLayout>{children}</UiLayout>
      </body>
    </html>
  );
}

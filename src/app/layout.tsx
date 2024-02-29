import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import UiLayout from "@/components/UiLayout";
import { SolanaProvider } from "@/components/SolanaProvider";

const defaultFont = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

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
      <body className={defaultFont.className}>
        <UiLayout>
          <SolanaProvider>{children}</SolanaProvider>
        </UiLayout>
      </body>
    </html>
  );
}

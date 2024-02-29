"use client";

import { useWallet } from "@solana/wallet-adapter-react";

import Feed from "@/components/Feed";
import Login from "@/components/Login";

export default function Home() {
  const wallet = useWallet();

  return (
    <main className="overflow-hidden flex flex-col items-center min-h-screen max-h-screen bg-[#0F0F11]">
      {wallet.connected && wallet.publicKey ? <Feed /> : <Login />}
    </main>
  );
}

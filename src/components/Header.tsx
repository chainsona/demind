"use client";

import { Oswald } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { WalletButton } from "./SolanaProvider";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

type HeaderProps = {};

export default function Header({}: HeaderProps) {
  const router = useRouter();
  const wallet = useWallet();

  return (
    <div
      className="z-50 w-full
        flex justify-between
        bg-[#0F0F11]
        p-4 pr-2"
    >
      <div className="flex gap-2 items-center">
        <Link href="/">
          <div className="">
            <Image src={"/logo.png"} alt="demind logo" width={48} height={48} />
          </div>
        </Link>
        <div
          className={`flex items-cente gap-2 ${oswald.className} text-2xl font-bold text-gray-200`}
        >
          Demind{" "}
          <span
            className="rounded-md text-red-500 text-xs"
            onClick={() => {
              const storageId = `demind_${wallet?.publicKey?.toBase58() || ""}`;
              localStorage.removeItem(storageId);

              router.push("/");
              router.refresh();
            }}
          >
            ALPHA
          </span>
        </div>
      </div>

      <div className="flex justifyend translate-x-0 scale-75">
        <WalletButton />
      </div>
    </div>
  );
}

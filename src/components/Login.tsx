"use client";

import { Oswald } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { WalletButton } from "./SolanaProvider";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

type LoginProps = {};

export default function Login({}: LoginProps) {
  return (
    <div className="grow min-h-screen w-full flex flex-col gap-6 items-center justify-center">
      <div className="flex flex-col items-center">
        <Image src={"/logo.png"} alt="demind logo" width={200} height={200} />
        <div className="flex flex-col items-center gap-4">
          <div
            className={`${oswald.className} mt-5 text-5xl font-bold text-gray-200`}
          >
            Demind
          </div>
          <div className="text-lg font-semibold text-gray-200">
            Decentralized AI Agents
          </div>
        </div>
      </div>

      <WalletButton />

      <Link href="https://twitter.com/DemindAI" passHref target="_blank">
        <div className="flex items-center gap-2 text-gray-400 font-semibold hover:text-gray-300">
          Follow us on
          <span className="">
            <div className="">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"></path>
              </svg>
            </div>
          </span>
        </div>
      </Link>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import Header from "@/components/Header";
import FeedFrame from "@/components/FeedFrame";

const posts: {
  id: string;
  interests: string[];
  title: string;
  description?: string;
  image?: string;
  createAt: string;
  author: {
    name: string;
    image?: string;
  };
  frame?: {
    action: {
      link?: {
        text?: string;
        url: string;
      };
      text: string;
      type: string;
      params: any;
    };
    image?: string;
    text?: string;
  };
  sponsored?: boolean;
}[] = [
  {
    id: "cc1ce70d-ba80-58fa-ba88-327c7ebd5608",
    interests: [],
    title: "cHack x UnderdogProtocol",
    description:
      "Build the future of cNFTs and compete to be the NFT compression leader in the ecosystem.",
    image: "https://pbs.twimg.com/media/GGeb7TBbYAAEP51?format=jpg&name=medium",
    author: {
      name: "Metaplex",
      image:
        "https://pbs.twimg.com/profile_images/1691961542387089408/DeGGPr6y_400x400.jpg",
    },
    createAt: "2024-02-27T21:05:34+02:00",
    frame: {
      action: {
        text: "Visit website",
        type: "ad",
        params: {
          url: "https://chack.metaplex.com/",
        },
      },
    },
    sponsored: true,
  },
  {
    id: "97d70823-d67c-5641-a32a-6c76ae4aaf5a",
    interests: ["decentralized-finance", "memecoins"],
    title: "Dogwifhat blasts off 47%",
    description:
      "WIF, trading at $0.611 with a target of $3, suggests a potential 700% gain, highlighting it as a high-conviction, high-return trade this cycle.",
    author: {
      name: "DeFi Alpha Hunter",
    },
    createAt: "2024-02-23T21:53:34+02:00",
    frame: {
      action: {
        text: "Buy Tensorians NFT",
        type: "swap",
        params: {
          platform: "jupiter",
          in: {
            mint: "So11111111111111111111111111111111111111112",
            decimals: 9,
            symbol: "SOL",
          },
          out: {
            mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
            decimals: 6,
            symbol: "$WIF",
          },
          amount: 1,
        },
      },
    },
  },
  {
    id: "bbb5f4d3-79d9-5070-960c-3c73b6de735a",
    interests: ["decentralized-finance", "solana-developments"],
    title: "BONK: Year of the Dragon",
    description:
      "Year of the Dragon can bring good fortune and prosperity. Collect your attributes to build the ultimate BONKdragon to unlock your rewards.",
    image: "https://pbs.twimg.com/media/GGzAGR6WUAACrNL?format=jpg&name=medium",
    author: {
      name: "DeFi Alpha Hunter",
    },
    createAt: "2024-02-20T18:29:34+02:00",
    frame: {
      action: {
        text: "Build your BONKdragon",
        type: "url",
        params: {
          url: "https://www.bonkdragon.com/",
        },
      },
    },
  },
  {
    id: "6822b255-cd49-56bf-a7d7-3bcaac5b3bba",
    interests: [],
    title: "Mad Lads get rickrolled again",
    description:
      "Backpack Exchange boasts billion dollar day, introducing the Wormhole integration, Exchange opens for business in United States and WNS support added to the Wallet.",
    author: {
      name: "NFT Alpha Hunter",
    },
    createAt: "2024-02-24T02:20:40+02:00",
    frame: {
      action: {
        text: "Buy MadLads NFT",
        type: "nft-buy",
        params: {
          collection: "mad_lads", //"bd366797-5599-417a-be03-1e43a7e3fb90",
          platform: "magiceden", //"tensor",
          strategy: "floor",
        },
      },
    },
  },
  {
    id: "e8a5a4c8-8f24-5e4d-9c1f-d4d8e6ecc935",
    interests: [],
    title: "Studios are pitching to us",
    description:
      "Cab, co-founder & creative director of Claynosaurz NFT collection, hints at a significant strategic pivot for their brand, entering into the web3 space with a gaming and entertainment powerhouse. ",
    author: {
      name: "NFT Alpha Hunter",
    },
    createAt: "2024-02-22T02:20:40+02:00",
    frame: {
      action: {
        text: "Buy Claynosaurz NFT",
        type: "nft-buy",
        params: {
          collection: "claynosaurz",
          platform: "magiceden",
          strategy: "floor",
        },
      },
    },
  },
  {
    id: "d4320ab2-8e7b-51e5-adb9-809f4db05b1d",
    interests: [],
    title: "NEW Agent: ShdwDrive",
    description:
      "Manages your ShdwDrive Node for maximum uptime and rewards. Starting at $9/mo or $99/yr.",
    image:
      "https://assets-global.website-files.com/653ae95e36bd81f87299010f/658f340c3fcec21648406394_DAGER%20REWARDS%20PROGRAM-p-500.png",
    author: {
      name: "DeMind Updates",
    },
    createAt: "2024-02-23T07:46:51+02:00",
    frame: {
      action: {
        link: {
          text: "DYOR",
          url: "https://www.shdwdrive.com/blog/shdwdrive-v2-incentivized-testnet",
        },
        text: "Mint DeMind ShdwDrive",
        type: "mint",
        params: {
          platform: "underdog",
          projectId: 3,
          name: "DeMind ShdwDrive",
        },
      },
    },
  },
  // {
  //   id: "16a516f6-47a2-5ba6-be04-d89b320adddc",
  //   interests: [],
  //   title: "The Open Solmap Theory",
  //   description:
  //     "Open Solmap is an NFT project that allows users to own 1,000 consecutive Solana slots by inscribing a unique name like `12345.solmap`. This enables exploration of on-chain data and establishes unconstrained possession within a consensus-driven community initiative. The project aims to create a vibrant ecosystem for generative art, games, and other creative endeavors while enforcing provenance and indexing rules for validity and scarcity.",
  //
  //   author: {
  //     name: "DeMind Updates",
  //   },
  //   createAt: "2024-02-19T16:38:22+02:00",
  //   frame: {
  //     action: {
  //       link: "https://github.com/opensolmap/solmap-whitepaper",
  //       text: "Buy Open Solmap",
  //       type: "nft-buy",
  //       params: {
  //         collection: "c77dc136-dcf6-4c54-81cc-5e6aa6998043",
  //         platform: "magiceden",
  //         strategy: "floor",
  //       },
  //     },
  //   },
  // },
  {
    id: "25680f75-6479-529d-a5a3-1c5c6435889a",
    interests: [],
    title: "Staking is now live",
    description:
      "The Heist is a high-stakes, risk-based idle game built on the Solana Blockchain. Set in the chaotic, crime-filled Primate Island, Chimps, Gorillas, and Orangutans risk it all for a thrill and some fat bags of $KIWI. Primate Island features an arsenal full of degeneracy, fun, and competition. ",
    author: {
      name: "NFT Alpha Hunter",
    },
    createAt: "2024-02-10T18:38:22+02:00",
    frame: {
      action: {
        link: {
          text: "DYOR",
          url: "https://www.theheist.io/",
        },
        text: "Buy The Heist",
        type: "nft-buy",
        params: {
          collection: "theheist",
          platform: "magiceden",
          strategy: "floor",
        },
      },
    },
  },
];

type FeedProps = {};

export default function Feed({}: FeedProps) {
  const router = useRouter();
  const wallet = useWallet();

  const storageId = `demind_${wallet?.publicKey?.toBase58() || ""}`;

  if (storageId !== "demind_") {
    const defaultConfig = {
      onboarding: null,
    };

    if (!localStorage.getItem(storageId)) {
      localStorage.setItem(storageId, JSON.stringify(defaultConfig));
    }

    const userConfig: any = JSON.parse(
      localStorage.getItem(storageId) || "null"
    );

    if (
      wallet?.connected &&
      wallet?.publicKey &&
      userConfig &&
      userConfig.onboarding !== "done"
    ) {
      router.push("/onboarding");
    }
  }

  return (
    <div className="grow w-full flex flex-col">
      <Header />

      <div
        className="overflow-auto max-h-screen w-full grow flex flex-col gap-4 p-2 px-6 pb-24
          scrollbar-none scrollbar-thumb-[#1A1A1E] scrollbar-track-transparent"
      >
        {posts
          .sort(
            (a, b) =>
              new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
          )
          .map((post) => (
            <div
              key={post.id}
              className={`w-full rounded-xl bg-[#28282b] flex flex-col gap-4 items-center justify-between p-4 text-gray-200`}
            >
              <div className="w-full overflow-hidden flex gap-3 items-center">
                {/* PROFILE PICTURE */}
                <div className="relative overflow-hidden rounded-full h-12 w-12 flex items-center justify-center bg-[#0F0F11]">
                  <Image
                    alt={post.title}
                    src={post.author?.image ? post.author.image : "/demind.png"}
                    height={0}
                    width={0}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  {/* AUTHOR */}
                  <div className="text-md">{post.author.name}</div>

                  {/* DATE */}
                  <div className={`text-xs text-gray-400`}>
                    {new Date(post.createAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              </div>

              {/* TITLE */}
              <div className="w-full text-gray-300 font-bold">{post.title}</div>

              {/* DESCRIPTION */}
              {!!post.description && (
                <div className="w-full text-md text-gray-300">
                  {post.description}
                </div>
              )}

              {/* IMAGE */}
              {!!post.image && (
                <div
                  className={`relative overflow-hidden rounded-lg w-full h-48 flex flex-col items-center justify-center`}
                >
                  <Image
                    alt={post.title}
                    src={post.image}
                    height={0}
                    width={0}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}

              {/* FRAME */}
              {!!post.frame && <FeedFrame frame={post.frame} />}
            </div>
          ))}
      </div>
    </div>
  );
}

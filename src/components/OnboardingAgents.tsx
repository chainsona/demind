"use client";

import { Oswald } from "next/font/google";
import { useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import DialogButtons from "@/components/DialogButtons";
import SelectList from "./SelectList";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

const featuredAgents: any[] = [
  {
    id: "metaplex-updates",
    name: "Metaplex Updates",
    collection: null,
    description: "Get updated on Solana Developments and Events.",
    image:
      "https://yt3.googleusercontent.com/xKrsMBoC5QgzEOQvMx-LDvxSQAUWOCn4r9N5W_QgWfC1aNJZKnbAO5TEqC3jKtbV9kNevE4hHQ=s176-c-k-c0x00ffffff-no-rj",
    interests: ["solana"],
    price: {
      amount: 0,
      currency: "SOL",
    },
    featured: true,
    creator: "Metaplex",
  },
  {
    id: "demind-updates",
    name: "DeMind Updates",
    collection: null,
    description: "Get updated on DeMind Developments and Events.",
    image: null,
    interests: ["demind"],
    price: {
      amount: 0,
      currency: "SOL",
    },
    featured: true,
    creator: "DeMind",
  },
];

const agents: any[] = [
  {
    id: "solana-updates",
    name: "Solana Updates",
    collection: null,
    description: "Get updated on Solana Developments and Events.",
    image:
      "https://www.cityam.com/wp-content/uploads/2021/08/Solana-1.jpg?resize=742,495",
    interests: ["blockhain"],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "Solana Foundation",
  },
  {
    id: "tensor-nft-insights",
    name: "NFT Insights",
    collection: null,
    description:
      "Real-time analysis of NFT markets from Solana's Leading NFT Marketplace.",
    image:
      "https://prod-image-cdn.tensor.trade/images/90x90/freeze=false/https%3A%2F%2Fprod-tensor-creators-s3.s3.us-east-1.amazonaws.com%2Fimage-cf7ad689-c0f4-4a54-908e-69577964c719",
    interests: ["non-fungible-token"],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "Tensor",
  },
  {
    id: "defi-alpha-hunter",
    name: "DeFi Alpha Hunter",
    collection: null,
    description:
      "Real-time analysis of DeFi markets, aiding investors in identifying lucrative opportunities.",
    image: null,
    interests: ["decentralized-finance", "meme-coins"],
    price: {
      amount: 4.2,
      currency: "SOL",
    },
    creator: "DeMind",
  },
  {
    id: "nft-alpha-hunter",
    name: "NFT Alpha Hunter",
    collection: null,
    description:
      "Real-time analysis of NFT markets, for collectors and JPG degens.",
    image: null,
    interests: ["non-fungible-token"],
    price: {
      amount: 6.9,
      currency: "SOL",
    },
    creator: "DeMind",
  },
  {
    id: "degen-news",
    name: "Degen News",
    collection: null,
    description: "Reporting NFT nonsense.",
    image:
      "https://pbs.twimg.com/profile_images/1551586710873550848/8_M8f6ds_400x400.jpg",
    interests: ["decentralized-finance", "non-fungible-token"],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "Degenerate News",
  },
  {
    id: "driphaus",
    name: "Creator Drop",
    collection: null,
    description: "Free collectibles every week from curated creators.",
    image:
      "https://ugc.production.linktr.ee/QwSahFLfSgyef7FwRyQh_kVi3oBICI27Pr86d?io=true&size=avatar-v3_0",
    interests: ["non-fungible-token"],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "DRiP",
  },
  {
    id: "hivemapper",
    name: "Hivemapper Updates",
    collection: null,
    description:
      "The world's freshest map data. Trusted by innovators across mapping, automotive, logistics, and more.",
    image:
      "https://pbs.twimg.com/profile_images/1452753067565150209/0vNHg64c_400x400.jpg",
    interests: [
      "decentralized-physical-infrastructure-networks",
      "non-fungible-token",
    ],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "Hivemapper",
  },
  {
    id: "render",
    name: "Render Updates",
    collection: null,
    description:
      "The Render Network connects artists looking to render next-gen 3D media with near unlimited GPUs in a decentralized global network. AI GPU's next ",
    image:
      "https://pbs.twimg.com/profile_images/1457177843780263941/UZz903Wg_400x400.jpg",
    interests: [
      "decentralized-physical-infrastructure-networks",
      "artificial-intelligence",
    ],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "Render",
  },
  {
    id: "genesysgo",
    name: "GenesysGo Updates",
    collection: null,
    description:
      "shdwDrive is the fastest and most scalable decentralized data storage network. Follow for the latest news and updates from the shdwDrive ecosystem.",
    image:
      "https://pbs.twimg.com/profile_images/1573020355022782464/FOW1khTJ_400x400.jpg",
    interests: [
      "decentralized-physical-infrastructure-networks",
      "artificial-intelligence",
      "non-fungible-token",
      "decentralized-storage",
    ],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "Render",
  },
  {
    id: "underdogprotocol",
    name: "Underdog Updates",
    collection: null,
    description:
      "Easily create and manage Digital Assets on Solana via our APIs and tools.",
    image:
      "https://pbs.twimg.com/profile_images/1640718191558291456/IHqdwitj_400x400.jpg",
    interests: [
      "non-fungible-token",
      "real-world-asset",
      "decentralized-physical-infrastructure-networks",
      "decentralized-finance",
    ],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "Underdog",
  },
  {
    id: "solarplex",
    name: "Solarplex Updates",
    collection: null,
    description:
      "Solarplex is a social marketplace that helps creators build authentic relationships with their audience.",
    image:
      "https://pbs.twimg.com/profile_images/1613625807494344706/GWPzBJpz_400x400.jpg",
    interests: ["non-fungible-token", "social"],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "Solarplex",
  },
  {
    id: "photofinish",
    name: "Photo Finish Updates",
    collection: null,
    description:
      "Official partner of the Kentucky Derby! Own virtual horses and run authentic races against REAL players for REAL money! ",
    image:
      "https://pbs.twimg.com/profile_images/1691232363181658112/j7E9viuX_400x400.png",
    interests: ["non-fungible-token", "gaming"],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "Photo Finish",
  },
  {
    id: "3rd-land",
    name: "The 3rd Dimension",
    collection: null,
    description: "A creator first, low fee launchpad only possible on Solana.",
    image:
      "https://pbs.twimg.com/profile_images/1699233127091060736/w7FuqDYa_400x400.jpg",
    interests: ["digital-art", "non-fungible-token"],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "3.land",
  },
  {
    id: "elusiv",
    name: "Elusiv",
    collection: null,
    description:
      "Ensures privacy remains a human right without sacrificing security, safety, and decentralization.",
    image:
      "https://pbs.twimg.com/profile_images/1588185632668635136/s5Mr_4AM_400x400.jpg",
    interests: ["privacy-security"],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "Elusiv",
  },
  {
    id: "bonk",
    name: "Bonk",
    collection: null,
    description: "The community token of web3",
    image:
      "https://pbs.twimg.com/profile_images/1600956334635098141/ZSzYTrHf_400x400.jpg",
    interests: [
      "decentralized-finance",
      "memecoins",
      "non-fungible-token",
      "yield-farming",
    ],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "Bonk",
  },
  {
    id: "dogwifhat",
    name: "WIF",
    collection: null,
    description: "Popular meme Dogwifhat vibes wif frens onchain.",
    image:
      "https://pbs.twimg.com/profile_images/1723823186473529344/nms-iIKi_400x400.jpg",
    interests: ["decentralized-finance", "memecoins", "non-fungible-token"],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "dogwifcoin",
  },
  {
    id: "lightspeed-podcast",
    name: "Lightspeed",
    collection: null,
    description:
      "A podcast for those who want a fresh, pragmatic take on the state of crypto.",
    image:
      "https://pbs.twimg.com/profile_images/1659213235898425352/1OnuLOW6_400x400.jpg",
    interests: ["blockchain", "decentralized-finance"],
    price: {
      amount: 0,
      currency: "SOL",
    },
    creator: "dogwifcoin",
  },
];

type OnboardingAgentsProps = {
  handlePrevious: () => void;
  handleNext: (params?: any) => void;
};

export default function OnboardingAgents({
  handlePrevious,
  handleNext,
}: OnboardingAgentsProps) {
  const wallet = useWallet();
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const userInterests = useMemo((): string[] => {
    const storageId = `demind_${wallet?.publicKey?.toBase58() || ""}`;
    const userConfig: any = JSON.parse(
      localStorage.getItem(storageId) || "null"
    );

    if (!userConfig) return [];

    return userConfig.interests;
  }, [wallet?.publicKey]);

  function handleMint() {
    let isMinted = false;

    // TODO Mint DeMinds from selected collection
    isMinted = true;

    if (isMinted) handleNext();
  }

  return (
    <div className="overflow-auto w-full grow flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div
          className={`mb-2 ${oswald.className} text-4xl text-gray-200 font-bold`}
        >
          Mint your AI agents
        </div>
        <div className={`text-sm text-gray-400 font-bold`}>
          DeMinds filter the noise, bringing you actionable insights and trends
          before they hit the mainstream.
        </div>
      </div>
      <SelectList
        items={[
          ...featuredAgents,
          ...agents.filter((a) => {
            for (const i of a.interests) {
              if ((userInterests || []).includes(i)) return true;
            }
            return false;
          }),
        ]}
        selectedItems={selectedAgents}
        setSelectedItems={setSelectedAgents}
        showImage={true}
      />

      <DialogButtons
        invalidationText="Previous"
        invalidationFn={() => handlePrevious()}
        invalidationVisible={true}
        validationEnabled={true}
        validationFn={() => handleMint()}
        validationText={selectedAgents.length > 0 ? "Mint" : "Skip"}
      />
    </div>
  );
}

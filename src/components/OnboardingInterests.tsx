"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import DialogButtons from "@/components/DialogButtons";
import SelectCard from "./SelectCard";

const interests = [
  {
    id: "digital-art",
    name: "Digital Art",
    image: "/digital-art.webp",
  },
  {
    id: "gaming",
    name: "Gaming",
    image: "/gaming.webp",
  },
  {
    id: "decentralized-finance",
    name: "DeFi",
    image: "/decentralized-finance.webp",
  },
  {
    id: "non-fungible-token",
    name: "NFT",
    image: "/non-fungible-token.webp",
  },
  {
    id: "blockchain",
    name: "Blockchain",
    image: "/blockchain.webp",
  },
  {
    id: "coding",
    name: "Coding",
    image: "/coding.webp",
  },
  {
    id: "artificial-intelligence",
    name: "Artificial Intelligence",
    image: "/artificial-intelligence.webp",
  },
  {
    id: "social",
    name: "Social",
    image: "/social.webp",
  },
  {
    id: "market-analysis",
    name: "Market Analysis",
    image: "/market-analysis.webp",
  },
  {
    id: "yield-farming",
    name: "Yield Farming",
    image: "/yield-farming.webp",
  },
  {
    id: "memecoins",
    name: "Memecoins",
    image: "/memecoins.webp",
  },
  {
    id: "decentralized-autonomous-organizations",
    name: "DAOs",
    image: "/decentralized-autonomous-organizations.webp",
  },
  {
    id: "privacy-security",
    name: "Privacy & Security",
    image: "/privacy-security.webp",
  },
  {
    id: "decentralized-physical-infrastructure-networks",
    name: "DePIN",
    image: "/decentralized-physical-infrastructure-networks.webp",
  },
  {
    id: "environmental-impact",
    name: "Environmental impact",
    image: "/environmental-impact.webp",
  },
  {
    id: "regulatory-compliance",
    name: "Regulatory and Compliance",
    image: "/regulatory-compliance.webp",
  },
];

type OnboardingInterestsProps = {
  handleNext: (params: any) => void;
};

export default function OnboardingInterests({
  handleNext,
}: OnboardingInterestsProps) {
  const wallet = useWallet();

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const getUserInterests = useCallback(() => {
    const storageId = `demind_${wallet?.publicKey?.toBase58() || ""}`;
    const userConfig: any = JSON.parse(
      localStorage.getItem(storageId) || "null"
    );

    if (!userConfig) return [];

    setSelectedInterests(userConfig?.interests || []);
  }, [wallet?.publicKey]);

  useEffect(() => {
    getUserInterests();
  }, [getUserInterests]);

  return (
    <div className="overflow-auto w-full grow flex flex-col gap-4">
      <div className="text-xl text-gray-300 font-bold">
        What topics are you interest in?
      </div>

      <SelectCard
        items={interests}
        selectedItems={selectedInterests}
        setSelectedItems={setSelectedInterests}
      />

      <DialogButtons
        validationText="Next"
        validationFn={() => handleNext({ interests: selectedInterests })}
        validationEnabled={selectedInterests?.length > 0}
      />
    </div>
  );
}

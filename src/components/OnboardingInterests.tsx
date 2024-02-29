"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import DialogButtons from "@/components/DialogButtons";
import SelectCard from "./SelectCard";

const interests = [
  {
    id: "digital-art",
    name: "Digital Art",
  },
  {
    id: "gaming",
    name: "Gaming",
  },
  {
    id: "decentralized-finance",
    name: "DeFi",
  },
  {
    id: "non-fungible-token",
    name: "NFT",
  },
  {
    id: "blockchain",
    name: "Blockchain",
  },
  {
    id: "coding",
    name: "Coding",
  },
  {
    id: "artificial-intelligence",
    name: "Artificial Intelligence",
  },
  {
    id: "social",
    name: "Social",
  },
  {
    id: "market-analysis",
    name: "Market Analysis",
  },
  {
    id: "yield-farming",
    name: "Yield Farming",
  },
  {
    id: "memecoins",
    name: "Memecoins",
  },
  {
    id: "decentralized-autonomous-organizations",
    name: "DAOs",
  },
  {
    id: "privacy-security",
    name: "Privacy & Security",
  },
  {
    id: "decentralized-physical-infrastructure-networks",
    name: "DePIN",
  },
  {
    id: "environmental-impact",
    name: "Environmental impact",
  },
  {
    id: "regulatory-compliance",
    name: "Regulatory and Compliance",
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

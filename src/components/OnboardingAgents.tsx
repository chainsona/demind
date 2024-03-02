"use client";

import { Oswald } from "next/font/google";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import DialogButtons from "@/components/DialogButtons";
import SelectList from "./SelectList";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

type OnboardingAgentsProps = {
  handlePrevious: () => void;
  handleNext: (params?: any) => void;
};

export default function OnboardingAgents({
  handlePrevious,
  handleNext,
}: OnboardingAgentsProps) {
  const wallet = useWallet();
  const [agents, setAgents] = useState<any[]>([]);
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

  const fetchAgents = useCallback(async () => {
    const url =
      `/api/agents` +
      (userInterests.length ? `?interests=${userInterests.join(",")}` : "");
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status !== 200) {
      console.error("Error fetching agents: ", res);
    }

    const data = await res.json();

    setAgents(data.data);
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

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
        items={agents || []}
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

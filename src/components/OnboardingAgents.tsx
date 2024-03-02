"use client";

import { Oswald } from "next/font/google";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
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

  const [loading, setLoading] = useState<boolean>(false);

  const userInterests = useMemo((): string[] => {
    const storageId = `demind_${wallet?.publicKey?.toBase58() || ""}`;
    const userConfig: any = JSON.parse(
      localStorage.getItem(storageId) || "null"
    );

    if (!userConfig) return [];

    return userConfig.interests;
  }, [wallet?.publicKey]);

  async function handleMint() {
    let isMinted = false;
    setLoading(true);

    // TODO Mint DeMinds from selected collection
    if (selectedAgents.length > 0) {
      try {
        const res = await fetch(`/api/nfts/mint`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: 2,
            receiverAddress: wallet?.publicKey?.toBase58(),
          }),
        });
        const data = await res.json();

        if (res.status === 409) {
          toast.warn(data.error);
          setLoading(false);
          return;
        }

        if (res.status !== 202) {
          toast.error(data);
          setLoading(false);
          return;
        }
        console.log("toast");
        toast.success(`Agents minted!`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        isMinted = true;
      } catch (e) {
        console.error(e);
        setLoading(false);
        return;
      }
    } else {
      isMinted = true;
    }

    if (isMinted) handleNext();

    setLoading(false);
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

    const filteredAgents = (data.data || []).filter((a: any) => {
      for (const i of a.interests) {
        if ((userInterests || []).includes(i)) return true;
      }
      return false;
    });

    setAgents(filteredAgents);
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return (
    <div className="overflow-auto w-full grow flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div
          className={`mb-2 ${oswald.className} text-4xl text-gray-200 font-bold`}
        >
          Mint your AI agents
        </div>
        <div className={`text-sm text-gray-400 font-semibold`}>
          DeMinds filter the noise, bringing you actionable insights and trends
          before they hit the mainstream.
        </div>
      </div>
      <SelectList
        items={(agents || []).filter((a) => {
          for (const i of userInterests) {
            if ((userInterests || []).includes(i)) return true;
          }
          return false;
        })}
        selectedItems={selectedAgents}
        setSelectedItems={setSelectedAgents}
        showImage={true}
      />

      <DialogButtons
        invalidationText="Back"
        invalidationFn={() => handlePrevious()}
        invalidationVisible={true}
        loading={loading}
        validationEnabled={true}
        validationFn={() => handleMint()}
        validationText={
          selectedAgents.length > 0
            ? "Mint" +
              (selectedAgents.reduce(
                (acc, a) =>
                  acc + agents.find((ag) => ag.id === a)?.price.amount,
                0
              ) > 0
                ? " for " +
                  selectedAgents.reduce(
                    (acc, a) =>
                      acc + agents.find((ag) => ag.id === a)?.price.amount,
                    0
                  ) +
                  " SOL"
                : "")
            : "Skip"
        }
      />
    </div>
  );
}

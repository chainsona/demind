"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import Header from "@/components/Header";

import OnboardingAgents from "@/components/OnboardingAgents";
import OnboardingInterests from "@/components/OnboardingInterests";

export default function Onboarding() {
  const router = useRouter();
  const { connected, publicKey } = useWallet();

  const [storageId, setStorageId] = useState<string>("demind_");
  const [step, setStep] = useState<string | null>(null);

  function handlePrevious() {
    const PreviousStep = (step: string | null) => {
      switch (step) {
        case "agents":
          return "interests";
      }
    };

    const pStep = PreviousStep(step);

    if (!pStep) return;

    const userConfig: any = JSON.parse(
      localStorage.getItem(storageId) || "null"
    );

    const config = {
      ...userConfig,
      onboarding: pStep,
    };

    localStorage.setItem(storageId, JSON.stringify(config));

    setStep(pStep);
  }

  function handleNext(params: any) {
    const nextStep = (step: string | null) => {
      switch (step) {
        case "interests":
          return "agents";
        case "agents":
          return "done";
        default:
          return step;
      }
    };

    const nStep = nextStep(step);

    const userConfig: any = JSON.parse(
      localStorage.getItem(storageId) || "null"
    );

    const config = {
      ...userConfig,
      onboarding: nStep,
    };

    if (params?.interests) {
      config.interests = params.interests;
    }

    localStorage.setItem(storageId, JSON.stringify(config));

    setStep(nStep);

    if (nStep === "done") router.push("/");
  }

  useEffect(() => {
    if (!publicKey) return;

    setStorageId(`demind_${publicKey?.toBase58() || ""}`);

    if (!connected && !publicKey) {
      router.push("/");
    }

    const userConfig: any = JSON.parse(
      localStorage.getItem(storageId) || "null"
    );

    if (!!userConfig) {
      if (userConfig.onboarding === "done") router.push("/");

      setStep(userConfig.onboarding || "interests");
    }
  }, [router, storageId, connected, publicKey]);

  return (
    <main className="overflow-hidden min-h-screen max-h-screen flex flex-col items-center bg-[#0F0F11]">
      <Header />

      <div className="overflow-auto max-h-screen w-full grow flex flex-col gap-4 p-2 px-6 pb-6 bg-[#0F0F11]">
        {step === "interests" && (
          <OnboardingInterests handleNext={handleNext} />
        )}

        {step === "agents" && (
          <OnboardingAgents
            handlePrevious={handlePrevious}
            handleNext={handleNext}
          />
        )}
      </div>
    </main>
  );
}

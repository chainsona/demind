"use client";

import { Oswald } from "next/font/google";
import React from "react";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

type InputActionProps = {
  disabled?: boolean;
  value: string;
  variant?: string;
  onChange: (value: string) => void;
};

export default function InputAction({
  disabled,
  value,
  variant,
  onChange,
}: InputActionProps) {
  const variant_ = variant || "primary";

  const variantStyle = (variant: string) => {
    switch (variant) {
      case "primary":
        return "bg-purple-800 focus:bg-purple-600 hover:bg-purple-600";
      case "secondary":
        return "bg-gray-900 focus:bg-gray-800 hover:bg-gray-800";
    }
  };

  return (
    <div
      className={`w-full h-full rounded-md
    ${variantStyle(variant_)}
    p-2 flex items-center justify-end ${
      oswald.className
    } disabled:bg-[#3A393F]`}
    >
      <input
        type="text"
        className={`w-full px-2 bg-transparent border-none outline-none text-right text-white`}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </div>
  );
}

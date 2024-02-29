"use client";

import { Oswald } from "next/font/google";
import React from "react";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

type SelectActionProps = {
  disabled?: boolean;
  items: {
    label: string;
    value: string;
  }[];
  value: string;
  variant?: string;
  onChange: (value: string) => void;
};

export default function SelectAction({
  disabled,
  items,
  value,
  variant,
  onChange,
}: SelectActionProps) {
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
    <select
      className={`w-full h-full rounded-md
        ${variantStyle(variant_)}
        p-2 flex items-center justify-center ${
          oswald.className
        } disabled:bg-[#3A393F]`}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      value={value}
    >
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}

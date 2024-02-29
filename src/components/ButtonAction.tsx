"use client";

import { Oswald } from "next/font/google";
import React from "react";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

type ButtonActionProps = {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  variant?: string;
  onClick: () => void;
};

export default function ButtonAction({
  children,
  disabled,
  loading,
  variant,
  onClick,
}: ButtonActionProps) {
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
    <button
      className={`w-full h-full rounded-md
        ${variantStyle(variant_)}
        p-2 flex items-center justify-center ${
          oswald.className
        } disabled:bg-[#3A393F]`}
      disabled={disabled}
      onClick={() => onClick()}
    >
      {loading && (
        <span className="">
          <svg
            className="animate-spin -ml-1 mr-3 h-3 w-3 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
      <span className={`text-gray-300 disabled:text-gray-500 font-bold`}>
        {children}
      </span>
    </button>
  );
}

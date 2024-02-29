"use client";

import { Oswald } from "next/font/google";
import React from "react";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

type DialogButtonsProps = {
  invalidationFn?: () => void;
  invalidationText?: string;
  invalidationVisible?: boolean;
  validationEnabled?: boolean;
  validationFn: () => void;
  validationText: string;
};

export default function DialogButtons({
  invalidationFn,
  invalidationVisible,
  invalidationText,
  validationEnabled,
  validationFn,
  validationText,
}: DialogButtonsProps) {
  return (
    <div className="w-full flex justify-end">
      <div className="w-full">
        <div className="w-full flex gap-4 justify-center">
          {/* BTN_INVALIDATION */}
          {invalidationVisible && (
            <div className="rounded-md bg-[#3A393F] p-3 w-1/2 flex justify-center">
              <button
                className={`${oswald.className} text-gray-200 font-bold`}
                onClick={() =>
                  invalidationVisible && !!invalidationFn && invalidationFn()
                }
              >
                {invalidationText || "Cancel"}
              </button>
            </div>
          )}

          {/* BTN_VALIDATION */}
          <button
            className={`${
              invalidationVisible ? "w-1/2" : "w-full"
            } rounded-md bg-[#875bf1] focus:bg-[#A147E9] hover:bg-[#A147E9] disabled:bg-[#3A393F] p-3 flex justify-center ${
              oswald.className
            } text-gray-200 disabled:text-gray-500 font-bold`}
            onClick={() => validationFn()}
            disabled={!validationEnabled}
          >
            <span className={``}>{validationText || "Submit"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

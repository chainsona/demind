"use client";

import { Oswald } from "next/font/google";
import React from "react";
import ButtonAction from "./ButtonAction";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

type DialogButtonsProps = {
  invalidationFn?: () => void;
  invalidationText?: string;
  invalidationVisible?: boolean;
  loading?: boolean;
  validationEnabled?: boolean;
  validationFn: () => void;
  validationText: string;
};

export default function DialogButtons({
  invalidationFn,
  invalidationVisible,
  invalidationText,
  loading,
  validationEnabled,
  validationFn,
  validationText,
}: DialogButtonsProps) {
  return (
    <div className="w-full flex justify-end">
      <div className="w-full">
        <div className="w-full flex gap-4 justify-center items-stretch">
          {/* BTN_INVALIDATION */}
          {invalidationVisible && (
            <div
              className={`rounded-md bg-[#3A393F] p-3 ${
                (invalidationText || "").length > 5 ? "w-1/2" : "w-28"
              } flex justify-center`}
            >
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
          <div className="w-full">
            <ButtonAction
              onClick={() => validationFn()}
              disabled={!validationEnabled}
              loading={loading}
            >
              <span className={``}>{validationText || "Submit"}</span>
            </ButtonAction>
          </div>
        </div>
      </div>
    </div>
  );
}

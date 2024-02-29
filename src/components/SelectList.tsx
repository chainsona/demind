"use client";

import { Oswald } from "next/font/google";
import Image from "next/image";
import React from "react";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

type SelectListProps = {
  items: any[];
  selectedItems: string[];
  setSelectedItems: any;
  showImage?: boolean;
};

export default function SelectList({
  items,
  selectedItems,
  setSelectedItems,
  showImage,
}: SelectListProps) {
  const handleSelection = (id: string) => {
    console.debug(
      `handleSelection selectedItemss:before ${JSON.stringify(selectedItems)}`
    );

    if (selectedItems.includes(id)) {
      console.debug(`Remove items '${id}' from selection`);
      const selection = selectedItems.filter((x) => x !== id);
      setSelectedItems(selection);
      console.debug(
        `handleSelection selectedItems:after ${JSON.stringify(selection)}`
      );
      return;
    }

    console.debug(`Add items '${id}' from selection`);
    setSelectedItems([...selectedItems, id]);
    console.debug(
      `handleSelection selectedItems:after ${JSON.stringify([
        ...selectedItems,
        id,
      ])}`
    );
  };

  return (
    <div className="overflow-auto max-h-screen grow w-full flex flex-col gap-3">
      {items
        // .sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }))
        .map((item) => (
          <div
            key={item.id}
            className={`relative w-full rounded-lg ${
              selectedItems.includes(item.id) ? "bg-purple-800" : "bg-[#28282b]"
            } flex flex-col gap-4 items-center justify-between p-3 text-gray-200 font-bold`}
            onClick={() => handleSelection(item.id)}
          >
          {(item.featured || !!item.price?.amount) && (
            <div
              className={`absolute top-4 right-4 rounded-lg ${
                !item.price?.amount
                  ? "bg-[#0F0F11]"
                  : "bg-green-800 uppercase"
              } p-2 px-3 text-xs text-gray-200`}
            >
              {item.featured
                ? "FEATURED"
                : !item.price.amount
                ? ""
                : `${item.price.amount} ${item.price.currency}`}
            </div>
          )}

            <div className="w-full overflow-hidden flex gap-3 items-center">
              {showImage && (
                <div className="overflow-hidden rounded-lg h-12 w-12 flex items-center justify-center bg-[#0F0F11]">
                  <Image
                    alt={item.name}
                    src={item.image ? item.image : "/demind.png"}
                    height={0}
                    width={0}
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                {/* NAME */}
                <div className="text-md">{item.name}</div>

                <div className="flex gap-2 items-center">
                  {/* CREATOR */}
                  {item.creator && (
                    <div className="text-xs text-gray-400">{item.creator}</div>
                  )}
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            {!!item.description && (
              <div className="w-full px-1 text-md text-gray-300">
                {item.description}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

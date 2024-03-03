"use client";

import { Oswald } from "next/font/google";
import Image from "next/image";
import React from "react";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

type SelectCardProps = {
  items: any[];
  selectedItems: string[];
  setSelectedItems: any;
};

export default function SelectCard({
  items,
  selectedItems,
  setSelectedItems,
}: SelectCardProps) {
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
    <div className="overflow-auto max-h-screen grow w-full grid grid-cols-2 gap-3 flex-wrap">
      {items.map((item) => (
        <div
          key={item.id}
          className={`w-full rounded ${
            selectedItems.includes(item.id) ? "bg-[#875bf1]" : "bg-[#28282b]"
          } flex flex-col gap-4 items-center justify-between p-2 text-gray-200 font-bold`}
          onClick={() => handleSelection(item.id)}
        >
          <div className="relative grow rounded-lg flex items-center justify-center bg-[#0F0F11]">
            <Image
              alt={item.name}
              src={item.image ? item.image : "/black.png"}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-black opacity-40"></div>
            <div
              className={`absolute w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                flex flex-col gap-3 items-center p-2 justify-between ${oswald.className} text-center`}
            >
              <div className="text-gray-200 text-xl">{item.name}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

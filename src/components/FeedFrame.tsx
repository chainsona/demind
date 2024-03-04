"use client";

import { Oswald } from "next/font/google";
import Image from "next/image";
import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  VersionedTransaction,
  sendAndConfirmRawTransaction,
} from "@solana/web3.js";

import ButtonAction from "@/components/ButtonAction";
import InputAction from "@/components/InputAction";
import SelectAction from "@/components/SelectAction";

import { formatNumber, shortenNumber } from "@/utils/primitives";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

type FeedFrameProps = {
  frame: {
    action: {
      link?: {
        url: string;
        text?: string;
      };
      text: string;
      type: string;
      params: any;
    };
    image?: string;
    text?: string;
    user?: {
      address?: string;
    };
  };
};

export default function FeedFrame({ frame }: FeedFrameProps) {
  const { publicKey, sendTransaction, signAllTransactions } = useWallet();

  const [loading, setLoading] = React.useState<boolean>(false);

  const [image, setImage] = React.useState<string | null>(
    // frame?.action?.type === "nft-buy" ? "/demind.png" : null
    null
  );
  const [index, setIndex] = React.useState<number>(0);
  const [items, setItems] = React.useState<any[]>([]);
  const [itemData, setItemData] = React.useState<any | null>(null);
  const [userInput, setUserInput] = React.useState<any | null>(null);

  const handleMint = async () => {
    setLoading(true);

    // Check platform support
    if (!["underdog"].includes(frame.action.params?.platform)) {
      toast.error(`Platform '${frame.action.params?.platform}' not supported`);
      setLoading(false);
      return;
    }

    // Pay to mint
    let signature;

    if (publicKey && frame.action.params?.price) {
      const rpcConnection = new Connection(
        process.env.NEXT_PUBLIC_RPC_ENDPOINT || ""
      );

      try {
        let tx = new Transaction();
        switch (true) {
          case [
            undefined,
            null,
            "So11111111111111111111111111111111111111112",
          ].includes(frame.action.params.price?.mint):
            tx.add(
              SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey(
                  process.env.NEXT_PUBLIC_TREASURY_ADDRESS || ""
                ),
                lamports: frame.action.params.price?.amount * LAMPORTS_PER_SOL,
              })
            );
            break;
          default:
            throw new Error("Unsupported Mint currency");
        }
        tx.feePayer = publicKey;

        signature = await sendTransaction(tx, rpcConnection);
        console.log("Mint transaction", `https://solscan.io/tx/${signature}`);

        await rpcConnection.confirmTransaction(signature, "confirmed");
      } catch (e) {
        if (!String(e).includes("cancelled")) {
          console.error(e);
        }
        setLoading(false);
        return;
      }

      setLoading(false);
    }

    // Mint NFT
    switch (frame.action.params?.platform) {
      case "underdog":
        try {
          const res = await fetch(`/api/nfts/mint`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.UNDERDOG_API_KEY || ""}`,
            },
            body: JSON.stringify({
              projectId: frame.action.params.projectId,
              receiverAddress: publicKey?.toBase58(),
              signature,
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

          toast.success(`NFT ${frame.action.params.name} minted!`);
        } catch (e) {
          console.error(e);
          setLoading(false);
          return;
        }
        break;

      default:
        setLoading(false);
        return;
    }

    setLoading(false);
  };

  const handleBuyNft = async () => {
    setLoading(true);

    let txs: any[] = [];

    const rpcConnection = new Connection(
      process.env.NEXT_PUBLIC_RPC_ENDPOINT || ""
    );

    let payload: any = {};
    switch (frame.action.params.platform) {
      case "magiceden":
        payload = {
          ...items[index],
          buyer: publicKey?.toBase58(),
          platform: "magiceden",
        };
        break;
      case "tensor":
        payload = {
          platform: "tensor",
          collection: frame.action.params.collection,
          mint: items[index]?.mint,
          price: items[index]?.price,
          buyer: publicKey?.toBase58(),
        };
        break;
      default:
        toast.error("Platform not supported");
    }

    if (!payload.mint) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/nfts/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicKey?.toBase58()}`,
        },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();
      txs = resData.data.tx ? [resData.data] : resData.data;
    } catch (e) {
      toast.error(`Cannot buy NFT '${itemData.content.metadata.name}'`);
      console.error(e);
      setLoading(false);
      return;
    }

    const txsToSign = txs.map((tx) => {
      return tx.txV0
        ? VersionedTransaction.deserialize(tx.txV0.data)
        : tx.txSigned
        ? Transaction.from(tx.txSigned.data)
        : Transaction.from(tx.tx.data);
    });

    if (!signAllTransactions) {
      setLoading(false);
      return;
    }

    let txsSigned;

    try {
      txsSigned = await signAllTransactions(txsToSign);
    } catch (e) {
      console.error(e);
      setLoading(false);
      return;
    }

    if (txsSigned) {
      let latestBlockhash = await rpcConnection.getLatestBlockhash();

      for (const tx of txsSigned) {
        try {
          const signature = await sendTransaction(tx, rpcConnection);
          await rpcConnection.confirmTransaction(
            { signature, ...latestBlockhash },
            "confirmed"
          );
          toast.success("NFT bought!");
        } catch (e) {
          toast.error(`Failed to buy NFT '${itemData.content.metadata.name}'`);
          console.error(e);
          setLoading(false);
          return;
        }
      }
    }
    setLoading(false);
  };

  const handleSwap = async () => {
    setLoading(true);

    const rpcConnection = new Connection(
      process.env.NEXT_PUBLIC_RPC_ENDPOINT || "",
      {
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 10000,
      }
    );

    let data;
    const url =
      `/api/tokens/swap?` +
      `user=${publicKey?.toBase58()}` +
      `&inputMint=${userInput.mint || frame.action.params.in.mint}` +
      `&outputMint=${frame.action.params.out.mint}` +
      `&amount=${
        (!!userInput.amount
          ? parseFloat(userInput.amount)
          : frame.action.params.amount) *
        10 ** (userInput.decimals || frame.action.params.in.decimals)
      }` +
      `&slippage=${userInput.slippage || 1}`;

    try {
      const res = await fetch(url);
      data = await res.json();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }

    if (!signAllTransactions) {
      setLoading(false);
      return;
    }

    // Build transaction
    const txs = [
      VersionedTransaction.deserialize(
        Buffer.from(data.data.swapTransaction, "base64")
      ),
    ];

    // Sign transaction
    let txsSigned;

    try {
      txsSigned = await signAllTransactions(txs);
    } catch (e) {
      console.error(e);
      setLoading(false);
      return;
    }

    // Send transaction and wait for confirmation
    try {
      const signature = await sendAndConfirmRawTransaction(
        rpcConnection,
        Buffer.from(txsSigned[0].serialize()),
        {
          commitment: "confirmed",
          maxRetries: 2,
          skipPreflight: true,
        }
      );
      console.log("Swap transaction", `https://solscan.io/tx/${signature}`);
      toast.success("Swap successful.");
    } catch (e) {
      toast.error(`Failed to swap`);
      console.error(e);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const fetchNftListings = useCallback(async () => {
    if (
      ["nft-buy"].includes(frame.action.type) &&
      frame.action.params?.collection &&
      frame.action.params?.platform
    ) {
      try {
        const res = await fetch(
          `/api/nfts/listings?collection=${frame.action.params.collection}` +
            `&platform=${frame.action.params.platform}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicKey?.toBase58()}`,
            },
          }
        );
        const payload = await res.json();
        setItems(Object.values(payload.data));
      } catch (e) {
        toast.error(
          `Cannot fetch '${frame.action.params.collection}' NFT litstings`
        );
        console.error(e);
      }
    }
    return null;
  }, [frame.action.type, frame.action.params, publicKey]);

  const fetchTokenList = useCallback(async () => {
    if (frame.action.type === "swap") {
      let retries = 3;
      do {
        try {
          const res = await fetch(`/api/tokens`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const payload = await res.json();

          setItems(payload.data);

          setUserInput({
            ...frame.action.params.in,
            amount: frame.action.params.amount,
            image: payload.data.find(
              (item: any) => item.address === frame.action.params.mint
            )?.logoURI,
            decimals: payload.data.find(
              (item: any) => item.address === frame.action.params.mint
            )?.decimals,
          });
        } catch (e) {
          console.error(e);
        }
      } while (retries--);
    }
  }, [frame.action.type, frame.action.params]);

  const setCurrentItem = useCallback(async () => {
    if (items && items.length > 0) {
      if (index > items.length - 1) {
        setIndex(0);
        return;
      }

      switch (frame.action.type) {
        case "nft-buy":
          if (!items || items.length === 0) return;
          let nft: any = null;
          try {
            const res = await fetch(`/api/nfts?id=${items[index]?.mint}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${publicKey?.toBase58()}`,
              },
            });
            nft = await res.json();
            setItemData(nft.data);
          } catch (e) {
            toast.error(`Cannot fetch NFT '${items[index]?.mint}'`);
            console.error(e);
            return;
          }
          if (nft?.data?.content?.files && nft.data.content.files.length > 0) {
            setImage(nft.data.content.files[0].uri || "/demind.png");
          }
      }
    }
  }, [index, items, frame.action.type, publicKey]);

  useEffect(() => {
    fetchNftListings();
    fetchTokenList();
  }, [fetchNftListings, fetchTokenList]);

  useEffect(() => {
    setCurrentItem();
  }, [index, items, setCurrentItem]);

  return (
    <div
      className={`relative w-full rounded-xl bg-[#0F0F11] flex flex-col gap-3 items-center justify-between p-2 text-gray-200 font-bold`}
    >
      {/* PLATFORM */}
      {/* {itemData?.content?.metadata?.name && (
        <div
          className={`z-10 absolute top-4 left-4 rounded-lg flex bg-gray-900 p-2 px-3 ${oswald.className} text-sm  uppercase`}
        >
          {frame.action.params.platform}
        </div>
      )} */}

      {/* IMAGE */}
      {(userInput?.image || image || !!frame.image) && (
        <div
          className={`relative overflow-hidden rounded-lg w-full aspect-square flex flex-col items-center justify-center`}
        >
          <Image
            alt={"frame image"}
            src={userInput?.image || frame?.image || image || "/demind.png"}
            height={0}
            width={0}
            objectFit="contain"
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            placeholder="blur"
            blurDataURL={"/demind.png"}
          />
        </div>
      )}

      {itemData?.content?.metadata?.name && (
        <div className={`rounded-lg ${oswald.className} text-sm`}>
          {itemData.content.metadata.name}
        </div>
      )}

      {/* ACTIONS */}
      {["ad", "url", "mint"].includes(frame.action.type) && (
        <div className="w-full flex gap-2">
          <ButtonAction
            disabled={loading}
            loading={loading}
            onClick={() => {
              switch (frame.action.type) {
                case "ad":
                case "url":
                  window.open(frame.action.params?.url, "_blank");
                  break;

                case "mint":
                  handleMint();
                  break;
              }
            }}
          >
            {[undefined, null].includes(frame.action.params?.price?.amount)
              ? frame.action.text
              : frame.action.params.price?.amount === 0
              ? "Mint for free"
              : `Mint for ${frame.action.params?.price?.amount} ${
                  frame.action.params?.price?.symbol || "SOL"
                }`}
          </ButtonAction>

          {!!frame.action.link?.url && (
            <div className="relative w-28">
              <ButtonAction
                onClick={() => {
                  window.open(frame.action.link?.url, "_blank");
                }}
                variant={"secondary"}
              >
                <div className="text-sm uppercase">
                  {frame.action?.link?.text || "More"}
                </div>
                <div className="absolute top-1 right-1">
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="12"
                    width="12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </div>
              </ButtonAction>
            </div>
          )}
        </div>
      )}

      {frame.action.type === "nft-buy" && (
        <div className="w-full flex gap-2">
          <div className="w-28">
            <ButtonAction
              disabled={loading || !!!items?.length || index === 0}
              variant={"secondary"}
              onClick={() => {
                setLoading(true);
                setImage("/demind.png");
                setIndex(Math.max(0, index - 1));
                setLoading(false);
              }}
            >
              {"<"}
            </ButtonAction>
          </div>
          <div className="w-full">
            <ButtonAction
              disabled={loading || !!!items?.length}
              loading={loading}
              onClick={() => {
                handleBuyNft();
              }}
            >{`Buy${
              items?.[index]?.price
                ? " ◎" + shortenNumber(items?.[index]?.price)
                : ""
            }`}</ButtonAction>
          </div>
          <div className="w-28">
            <ButtonAction
              disabled={
                loading || !!!items?.length || index === items.length - 1
              }
              variant={"secondary"}
              onClick={() => {
                setLoading(true);
                setImage("/demind.png");
                setIndex(Math.min(items.length - 1, index + 1));
                setLoading(false);
              }}
            >
              {">"}
            </ButtonAction>
          </div>
        </div>
      )}

      {frame.action.type === "swap" && !!items?.length && (
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex gap-2">
            <div className="w-full">
              <InputAction
                variant={"secondary"}
                value={userInput?.amount || frame.action.params.amount || "0"}
                onChange={(value: string) => {
                  setUserInput({
                    ...userInput,
                    amount: value.replace(/[^0-9.]/g, ""),
                  });
                }}
              />
            </div>
            <div className="w-64">
              <SelectAction
                items={(items || []).map((item) => ({
                  label: item.symbol,
                  value: item.address,
                }))}
                variant={"secondary"}
                value={userInput?.mint || frame.action.params.amount || "0"}
                onChange={(value: string) => {
                  const uInput = {
                    ...userInput,
                    mint: value,
                    decimals: items?.find((item) => item.address === value)
                      ?.decimals,
                    // image: items?.find((item) => item.address === value)?.logoURI,
                  };
                  setUserInput(uInput);
                }}
              />
            </div>
          </div>
          <div className="w-full flex gap-2">
            <ButtonAction
              disabled={loading || !!!items?.length}
              loading={loading}
              onClick={() => {
                handleSwap();
              }}
            >
              {`Swap ${formatNumber(
                parseFloat(userInput?.amount) || frame.action.params.amount,
                0,
                4
              )} ${
                items?.find((item) => item.address === userInput?.mint)?.symbol
              } to ${
                items?.find(
                  (item) => item.address === frame.action.params.out.mint
                )?.symbol
              }`}
            </ButtonAction>

            {!!frame.action.link?.url && (
              <div className="relative w-28">
                <ButtonAction
                  onClick={() => {
                    window.open(frame.action.link?.url, "_blank");
                  }}
                  variant={"secondary"}
                >
                  <div className="text-sm uppercase">
                    {frame.action?.link?.text || "More"}
                  </div>
                  <div className="absolute top-1 right-1">
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      height="12"
                      width="12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </div>
                </ButtonAction>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

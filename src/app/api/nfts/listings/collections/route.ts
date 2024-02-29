import { headers } from "next/headers";
import {
  LAMPORTS_PER_SOL,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

import { extractUrlParams } from "@/utils/web";

export async function GET(request: Request) {
  console.debug("GET /api/nfts/listings/collections");
  const params = extractUrlParams(request.url);
  console.debug(params);

  const headersList = headers();

  // TODO Check authorization from JWT
  const authorization = headersList.get("authorization");
  console.debug("authorization:", authorization);

  // if (!authorization)
  //   return Response.json({ error: "Unauthorized" }, { status: 401 });

  let retries = 3;

  switch (params.platform?.value) {
    case "magiceden":
      let collectionsMagicEden: any[] = [];
      let collectionsMagicEdenArray: any[] = [];

      const limit = 500;
      const hardLimit = 1000000;
      let offset = 0;

      do {
        retries--;

        try {
          const collectionsMagicEdenRes = await fetch(
            `https://api-mainnet.magiceden.dev/v2/collections?limit=${limit}&offset=${
              offset * limit
            }`
          );
          const collectionsMagicEdenData = await collectionsMagicEdenRes.json();

          collectionsMagicEdenArray = collectionsMagicEdenData.map(
            (item: any) => {
              return {
                discord: item.discord,
                image: item.image,
                description: item.description,
                name: item.name,
                slug: item.symbol,
                twitter: item.twitter,
                website: item.website,
              };
            }
          );

          collectionsMagicEden = [
            ...collectionsMagicEden,
            ...collectionsMagicEdenArray,
          ];

          if (collectionsMagicEden.length >= hardLimit) break;

          offset++;
          retries = 3;
        } catch (e) {
          console.error(e);
          continue;
        }
      } while (retries > 0 && collectionsMagicEdenArray.length === limit);

      if (retries <= 0) {
        return Response.json(
          { error: "Error fetching Magic Eden listings" },
          { status: 500 }
        );
      }

      return Response.json({
        data: collectionsMagicEden,
      });

    case "tensor":
      let collectionsTensor: any[] = [];
      let collectionsTensorData: any = {};
      let page = 1;

      do {
        collectionsTensorData = {};
        try {
          const collectionsTensorRes = await fetch(
            "https://api.tensor.so/graphql",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-tensor-api-key":
                  process.env.TENSOR_API_KEY ??
                  "666b4c68-35d9-4f5a-b9e8-1f9eb48a6391",
              },
              body: JSON.stringify({
                query: `
        query CollectionsStats(
          $slugs: [String!]
          $slugsMe: [String!]
          $slugsDisplay: [String!]
          $ids: [String!]
          $sortBy: String,
          $page: Int,
          $limit: Int,
        ) {
          allCollections(
            slugs: $slugs,
            slugsMe: $slugsMe,
            slugsDisplay: $slugsDisplay,
            ids: $ids,
            sortBy: $sortBy,
            page: $page,
            limit: $limit
          ) {
            total
            page
            collections {
              id
              slug
              slugMe
              slugDisplay
              statsV2 {
                currency
                buyNowPrice
                buyNowPriceNetFees
                sellNowPrice
                sellNowPriceNetFees
                numListed
                numMints
                floor1h
                floor24h
                floor7d
                sales1h
                sales24h
                sales7d
                salesAll
                volume1h
                volume24h
                volume7d
                volumeAll
              }
              firstListDate
              name
            }
          }
        }
      `,
                variables: {
                  slugs: [],
                  slugsMe: null,
                  slugsDisplay: null,
                  ids: null,
                  sortBy: "statsV2.volume7d:desc",
                  limit: 50, // Max: 50
                  page: page++,
                },
              }),
              // next: { revalidate: 360 },
            }
          );
          collectionsTensorData = await collectionsTensorRes.json();
          console.log(
            "collectionsTensorData",
            JSON.stringify(collectionsTensorData, null, 2)
          );

          collectionsTensor = [
            ...collectionsTensor,
            ...collectionsTensorData.data.allCollections.collections.map(
              (x: any) => ({
                name: x.name,
                slug: x.slug,
                floor: parseInt(x.statsV2.buyNowPrice) / LAMPORTS_PER_SOL,
                volume7d: parseInt(x.statsV2.volume7d) / LAMPORTS_PER_SOL,
              })
            ),
          ];
          console.log(
            "volume7d",
            collectionsTensor.map((x) => x.volume7d).join(", ")
          );

          // wait 150ms
          await new Promise((resolve) => setTimeout(resolve, 150));
        } catch (e) {
          retries--;
          console.error(e);
          // wait 500ms
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } while (
        retries > 0 &&
        parseInt(collectionsTensor[collectionsTensor.length - 1].volume7d) >
          LAMPORTS_PER_SOL * 1
        // collectionsTensor[collectionsTensor.length - 1].statsV2.sales7d > 0
      );
      // console.log(collectionsTensor);

      return Response.json({
        data: collectionsTensor,
      });
  }

  return Response.json({ error: "Invalid platform" }, { status: 400 });
}

export async function POST(request: Request) {
  console.debug("POST /api/nfts/listings");

  const headersList = headers();

  // const authorization = headersList.get("authorization");
  // console.debug("authorization:", authorization);

  // if (!authorization)
  //   return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  console.debug("body", JSON.stringify(body));

  const buyTensorRes = await fetch("https://api.tensor.so/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tensor-api-key": process.env.TENSOR_API_KEY || "",
    },
    body: JSON.stringify({
      query: `
      query TswapBuySingleListingTx($buyer: String!, $maxPrice: Decimal!, $mint: String!, $owner: String!) {
        tswapBuySingleListingTx(
          buyer: $buyer
          maxPrice: $maxPrice
          mint: $mint
          owner: $owner
        ) {
          txs {
            lastValidBlockHeight
            tx
            txV0
          }
        }
      }
    `,
      variables: {
        buyer: body.buyer,
        maxPrice: (body.price * LAMPORTS_PER_SOL).toFixed(0),
        mint: body.mint,
        owner: body.owner,
      },
    }),
    next: { revalidate: 360 },
  });
  const buyTensorData = await buyTensorRes.json();
  // console.log("buyTensorData", JSON.stringify(buyTensorData, null, 2));

  // Make sure this matches what endpoint your hitting (eg `tswapBuyNftTx`, `tswapInitPoolTx`, etc)
  const opName = "tswapBuySingleListingTx";
  const txsToSign = buyTensorData.data[opName].txs.map((tx: any) =>
    tx.txV0
      ? VersionedTransaction.deserialize(tx.txV0.data)
      : Transaction.from(tx.tx.data)
  );
  // console.log("txsToSign", JSON.stringify(txsToSign));

  return Response.json({
    data: buyTensorData.data[opName].txs,
  });
}

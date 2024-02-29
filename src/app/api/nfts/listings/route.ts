import { headers } from "next/headers";
import {
  LAMPORTS_PER_SOL,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

import { extractUrlParams } from "@/utils/web";

export async function GET(request: Request) {
  console.debug("GET /api/nfts/listings");
  const params = extractUrlParams(request.url);
  console.debug(params);

  const headersList = headers();

  // TODO Check authorization from JWT
  const authorization = headersList.get("authorization");
  // console.debug("authorization:", authorization);

  // if (!authorization)
  //   return Response.json({ error: "Unauthorized" }, { status: 401 });

  switch (params.platform?.value) {
    // Magic Eden
    default:
    case null || "magiceden":
      try {
        const listingsMagicEdenRes = await fetch(
          `https://api-mainnet.magiceden.dev/v2/collections/${params.collection.value}/listings?sort=listPrice&limit=100`
        );
        const listingsMagicEdenData = await listingsMagicEdenRes.json();
        const listingsMagicEdenArray = listingsMagicEdenData.map(
          (item: any) => {
            return {
              pdaAddress: item.pdaAddress,
              auctionHouse: item.auctionHouse,
              tokenAddress: item.tokenAddress,
              mint: item.tokenMint,
              seller: item.seller,
              sellerReferral: item.sellerReferral,
              price: item.price,
            };
          }
        );

        // console.log("listingsMagicEdenMap", JSON.stringify(listingsMagicEdenMap, null, 2));
        return Response.json({
          data: listingsMagicEdenArray,
        });
      } catch (e) {
        console.error(e);
        return Response.json(
          { error: "Error fetching Magic Eden listings" },
          { status: 500 }
        );
      }

    case "tensor":
      // Tensor
      let listingsTensor: any[] = [];
      let listingsTensorData: any = {};
      let cursor = null;
      let retries = 3;
      let wantAll = false;

      do {
        try {
          listingsTensorData = {};
          const listingsTensorRes = await fetch(
            "https://api.tensor.so/graphql",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-tensor-api-key": process.env.TENSOR_API_KEY || "",
              },
              body: JSON.stringify({
                query: `
        query CollectionStats($slug: String!, $cursor: ActiveListingsCursorInputV2) {
          activeListingsV2(slug: $slug, sortBy: PriceAsc, cursor: $cursor) {
            page {
              endCursor {
                str
              }
              hasMore
            }
            txs {
              mint {
                onchainId
              }
              tx {
                sellerId
                grossAmount
              }
            }
          }
        }
      `,
                variables: {
                  slug: params.collection.value,
                  limit: 250,
                  cursor,
                },
              }),
              // next: { revalidate: 360 },
            }
          );
          listingsTensorData = await listingsTensorRes.json();

          listingsTensor = [
            ...listingsTensor,
            ...listingsTensorData.data.activeListingsV2.txs,
          ];
          cursor = listingsTensorData.data.activeListingsV2.page.endCursor;
        } catch (e) {
          retries--;
          console.error(e);
          // wait 500ms
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
        // wait 250ms
        await new Promise((resolve) => setTimeout(resolve, 250));
      } while (
        retries > 0 &&
        wantAll &&
        listingsTensorData.data.activeListingsV2.page.hasMore
      );

      const listingsTensorMap = listingsTensor.reduce((acc, tx) => {
        acc[tx.mint.onchainId] = {
          mint: tx.mint.onchainId,
          price: tx.tx.grossAmount / LAMPORTS_PER_SOL,
          owner: tx.tx.sellerId,
        };
        return acc;
      }, {});
      // console.log("listingsTensorMap", JSON.stringify(listingsTensorMap, null, 2));

      // console.log(listingsTensorMap);

      return Response.json({
        data: listingsTensorMap,
      });
  }
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

  switch (body.platform) {
    case "magiceden":
      const url =
        "https://api-mainnet.magiceden.dev/v2/instructions/buy_now?" +
        `buyer=${body.buyer}` +
        `&seller=${body.seller}` +
        `&sellerReferral=${body.sellerReferral}` +
        `&auctionHouseAddress=${body.auctionHouse}` +
        `&tokenMint=${body.mint}` +
        `&tokenATA=${body.tokenAddress}` +
        `&price=${body.price}`;

      try {
        const buyMagicEdenRes = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MAGIC_EDEN_API_KEY || ""}`,
          },
        });
        const buyMagicEdenData = await buyMagicEdenRes.json();

        return Response.json({
          data: buyMagicEdenData,
        });
      } catch (e) {
        console.error(e);
        return Response.json(
          { error: "Error fetching Magic Eden buy now instructions: " + e },
          { status: 500 }
        );
      }

    case "tensor":
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
            txV0 # If this is present, use this!
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

      const opName = "tswapBuySingleListingTx";

      return Response.json({
        data: buyTensorData.data[opName].txs,
      });

    default:
      return Response.json({ error: "Invalid platform" }, { status: 400 });
  }
}

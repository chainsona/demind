import { headers } from "next/headers";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { extractUrlParams } from "@/utils/web";

export async function POST(request: Request) {
  console.debug("GET /api/nfts/mint");

  const headersList = headers();

  // TODO Check authorization from JWT
  const authorization = headersList.get("authorization");
  // console.debug("authorization:", authorization);

  // if (!authorization)
  //   return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  console.debug("body", JSON.stringify(body));

  if (!body?.receiverAddress) {
    return Response.json(
      { error: "Receiver address is required" },
      { status: 400 }
    );
  }

  if (!body?.projectId) {
    return Response.json({ error: "Project ID is required" }, { status: 400 });
  }

  // TODO Fetch Collection from Underdog
  let project: any;

  try {
    const res = await fetch(
      `https://${
        process.env.UNDERDOG_NETWORK || "devnet"
      }.underdogprotocol.com/v2/projects/${body.projectId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.UNDERDOG_API_KEY || ""}`,
        },
      }
    );

    if (res.status !== 200) {
      return Response.json(
        { error: "Error fetching collection from Underdog" },
        { status: 422 }
      );
    }

    const data = await res.json();

    console.debug("project data", JSON.stringify(data));

    project = data;
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "Error fetching tokens from Jupiter" },
      { status: 500 }
    );
  }

  if (!project) {
    return Response.json({ error: "Collection not found" }, { status: 422 });
  }

  try {
    const res = await fetch(
      `https://${
        process.env.UNDERDOG_NETWORK || "devnet"
      }.underdogprotocol.com/v2/projects/${body.projectId}/nfts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.UNDERDOG_API_KEY || ""}`,
        },
        body: JSON.stringify({
          image: project.image,
          name: project.name,
          symbol: project.symbol,
          description: project.description,
          externalUrl: project.externalUrl,
          attributes: {
            ...project.attributes,
            Subscription: "Free",
            Expires: "Never",
            "Managed nodes": 0,
          },
          receiverAddress: body.receiverAddress,
        }),
      }
    );

    const data = await res.json();

    console.debug("data", JSON.stringify(data));

    return Response.json({ data }, { status: 202 });
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "Error fetching tokens from Jupiter" },
      { status: 500 }
    );
  }
}

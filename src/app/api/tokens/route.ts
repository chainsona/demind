import { headers } from "next/headers";
import {
  LAMPORTS_PER_SOL,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

import { extractUrlParams } from "@/utils/web";

export async function GET(request: Request) {
  console.debug("GET /api/tokens");
  const params = extractUrlParams(request.url);
  console.debug(params);

  const headersList = headers();

  // TODO Check authorization from JWT
  const authorization = headersList.get("authorization");
  // console.debug("authorization:", authorization);

  // if (!authorization)
  //   return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch(`https://token.jup.ag/strict`);
    const data = await res.json();

    return Response.json({ data });
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "Error fetching tokens from Jupiter" },
      { status: 500 }
    );
  }
}

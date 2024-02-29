import { headers } from "next/headers";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { extractUrlParams } from "@/utils/web";

export async function GET(request: Request) {
  console.debug("GET /api/nfts");
  const params = extractUrlParams(request.url);
  console.debug(params);

  const headersList = headers();

  // TODO Check authorization from JWT
  const authorization = headersList.get("authorization");
  // console.debug("authorization:", authorization);

  // if (!authorization)
  //   return Response.json({ error: "Unauthorized" }, { status: 401 });

  const rpcEndpoint = process.env.RPC_ENDPOINT || "";

  const response = await fetch(rpcEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAsset",
      params: {
        id: params.id.value,
      },
    }),
  });
  const { result } = await response.json();
  // console.log("Asset: ", result);

  return Response.json({
    data: result,
  });
}

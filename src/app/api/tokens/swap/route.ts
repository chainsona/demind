import { headers } from "next/headers";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

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

  // Request quote from Jupiter
  let quoteResponse: any;
  try {
    const res = await fetch(
      `https://quote-api.jup.ag/v6/quote` +
        `?inputMint=${params.inputMint.value}` +
        `&outputMint=${params.outputMint.value}` +
        `&amount=${params.amount.value}` +
        `&slippageBps=${params.slippage.value * 100}`
    );
    quoteResponse = await res.json();
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "Error fetching quote from Jupiter" },
      { status: 500 }
    );
  }
  // Request swap transaction instructions from Jupiter
  try {
    const res = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // quoteResponse from /quote api
        quoteResponse,
        // user public key to be used for the swap
        userPublicKey: params.user.value,
        // If 'auto' is used, Jupiter will automatically set a priority fee for the transaction,
        // it will be capped at 5,000,000 lamports / 0.005 SOL.
        // prioritizationFeeLamports: 0.0001 * LAMPORTS_PER_SOL, // or custom lamports: 1000

        // auto wrap and unwrap SOL. default is true
        wrapAndUnwrapSol: true,
        // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
        // feeAccount: "fee_account_public_key"
      }),
    });
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

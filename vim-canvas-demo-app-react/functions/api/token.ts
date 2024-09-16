import { parseJwt } from "@cfworker/jwt";
import { Env } from "../context-env";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { code } = await context.request.json<{ code: string }>();

  const vimResponse = await fetch(
    context.env.VIM_TOKEN_ENDPOINT ??
    "https://connect.getvim.com/os-api/v1/oauth/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: context.env.CLIENT_ID,
        code,
        secret: context.env.CLIENT_SECRET,
      }),
    }
  );

  const tokenData = await vimResponse.json();
  if (
    !(await isAuthorized(
      tokenData,
      context.env.CLIENT_ID,
      context.env.VIM_ISSUER
    ))
  ) {
    return new Response("", {
      status: 403,
      statusText: "Forbidden: You do not have access to this resource.",
    });
  }

  return Response.json(tokenData);
};

async function isAuthorized(
  vimTokenData,
  clientId: string,
  vimIssuer = "https://auth.getvim.com/"
) {
  try {
    const decodedIdToken = await parseJwt({
      jwt: vimTokenData.idToken,
      issuer: vimIssuer,
      audience: clientId,
    });
    if (decodedIdToken.valid) {
      // If identification data on token is not sufficient userinfo endpoint can be used...
      return await isUserEligibleToMyApp({
        email: decodedIdToken.payload["email"],
        vimUserId: decodedIdToken.payload["sub"],
      });
    } else if (decodedIdToken.valid === false) {
      console.error(
        `Failed to parse jwt ${decodedIdToken.reason} [${decodedIdToken.reasonCode}]`,
        {
          vimTokenData,
          vimIssuer,
          clientId,
        }
      );
      return false;
    }
  } catch (error) {
    console.error("Error verifying token", error);
    return false;
  }
}

async function isUserEligibleToMyApp({ email, vimUserId }) {
  console.info(`User ${email}, ${vimUserId} is eligible to my app.`);
  return true;
}

import { parseJwt } from "@cfworker/jwt";
import { Env } from "../context-env";

/** NOTE: Route is `/api/token` */
async function getToken(context, code: string, client_secret: string) {
  return fetch(
    context.env.VIM_TOKEN_ENDPOINT ?? "https://api.getvim.com/v1/oauth/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: context.env.CLIENT_ID,
        code,
        client_secret,
        grant_type: "authorization_code",
      }),
    }
  );
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { code } = await context.request.json<{ code: string }>();
  let vimResponse = await getToken(context, code, context.env.CLIENT_SECRET);
  if (
    vimResponse.status >= 400 &&
    vimResponse.status < 500 &&
    context.env.CLIENT_SECRET_FALLBACK
  ) {
    vimResponse = await getToken(
      context,
      code,
      context.env.CLIENT_SECRET_FALLBACK
    );
  }
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
      jwt: vimTokenData.id_token,
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

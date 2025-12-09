import { parseJwt } from "@cfworker/jwt";
import { Env } from "../context-env";

function getCorsHeaders(request: Request, env: Env) {
  const requestOrigin = request.headers.get("Origin");
  const allowed = (env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((s) => s.trim());
  const originAllowed = requestOrigin && allowed.includes(requestOrigin);
  return new Headers({
    "Access-Control-Allow-Origin": originAllowed ? requestOrigin : "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
}

async function getToken(context, code: string, client_secret: string) {
  return fetch(
    context.env.VIM_TOKEN_ENDPOINT ?? "https://api.staging.getvim.com/v1/oauth/token",
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

export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  const headers = getCorsHeaders(request, env);
  return new Response(null, { status: 204, headers });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
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
      const headers = getCorsHeaders(context.request, context.env);
      return new Response("", {
        status: 403,
        statusText: "Forbidden: You do not have access to this resource.",
        headers,
      });
    }
    const headers = getCorsHeaders(context.request, context.env);
    return Response.json(tokenData, { headers });
  } catch (error) {
    const headers = getCorsHeaders(context.request, context.env);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500, headers }
    );
  }
};

async function isAuthorized(
  vimTokenData,
  clientId: string,
  vimIssuer = "https://getvim.us.auth0.com/" // staging
  // vimIssuer = "https://auth.getvim.com/"
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

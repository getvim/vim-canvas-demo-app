import { parseJwt } from "@cfworker/jwt";
import { Env } from "../context-env";

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
        organization: decodedIdToken.payload["https://getvim.com/organization"],
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

async function isUserEligibleToMyApp({ email, vimUserId, organization }) {
  // add in supabase check?
  // make a new VIM db
  // make vimUsers table?
  // columns: id, vimUserId, email, status (trial, paid, inactive), created_at
  // sql automation: check status at 30 days after creation, if status = trial, set to inactive

  // need logic to check new users
  // how do we handle new user signup, what is their user flow?
  // how can we capture a VIM signup?

  console.info(`User ${email}, ${vimUserId} of organization ${organization} is eligible to my app.`);
  return true;
}

import { Env } from "../context-env";

const SETTINGS_LAUNCH_TYPE = "APP_SETTINGS";

/** NOTE: Route is `/api/launch` */
export const onRequestGet: PagesFunction<Env> = async (context) => {

  const url = new URL(context.request.url);
  const queryParams = url.searchParams;
  const launchId = queryParams.get("launch_id");
  const launchType = queryParams.get("launch_type");

  // Redirect to the settings application page if the launch type is APP_SETTINGS
  let redirect_uri = context.env.REDIRECT_URL ?? "http://localhost:8788";
  redirect_uri =
    launchType === SETTINGS_LAUNCH_TYPE
      ? `${redirect_uri}/settings`
      : redirect_uri;

  const redirectUrl = new URL(
    context.env.VIM_AUTHORIZE_ENDPOINT ??
      "https://api.getvim.com/v1/oauth/authorize"
  );
  redirectUrl.searchParams.append("launch_id", launchId);
  redirectUrl.searchParams.append("client_id", context.env.CLIENT_ID);
  redirectUrl.searchParams.append("redirect_uri", redirect_uri);
  redirectUrl.searchParams.append("response_type", "code");
  return Response.redirect(redirectUrl.toString(), 302);
};

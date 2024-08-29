import { Env } from "../context-env";

const appUrl = "https://vim-canvas-demo-app.pages.dev";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const queryParams = url.searchParams;
  const launchId = queryParams.get("launch_id");

  const redirectUrl = new URL(
    "https://connect.getvim.com/os-api/v1/oauth/authorize"
  );
  redirectUrl.searchParams.append("launch_id", launchId);
  redirectUrl.searchParams.append("client_id", context.env.CLIENT_ID);
  redirectUrl.searchParams.append("redirect_uri", appUrl);

  return Response.redirect(redirectUrl.toString(), 302);
};

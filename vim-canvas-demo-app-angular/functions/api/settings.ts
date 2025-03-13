import { Env } from "../context-env";
import { Settings } from "../../types";
import { jwtDecode } from "jwt-decode";

const ORGANIZATION_ID_CLAIM = "https://getvim.com/organizationId";

const extractOrgId = (token: string) => {
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const decodedToken = jwtDecode<{ [key: string]: string }>(token);
  return decodedToken?.[ORGANIZATION_ID_CLAIM];
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const { DB } = env;
  const token = context.request.headers.get("Authorization");
  const organizationId = extractOrgId(token);

  try {
    const data = await request.json<Settings>();
    const { theme_color } = data;

    const result = await DB.prepare(
      "INSERT INTO settings (organization_id, theme_color, created_at) VALUES (?, ?, ?) \
       ON CONFLICT (organization_id) \
       DO UPDATE SET \
       theme_color = excluded.theme_color"
    )
      .bind(organizationId, theme_color, new Date().toISOString())
      .run();

    return Response.json({ success: true, id: result.meta.last_row_id });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const { DB } = env;
  const token = context.request.headers.get("Authorization");
  const organizationId = extractOrgId(token);
  try {
    const result = await DB.prepare(
      "SELECT * FROM settings WHERE organization_id = ?"
    )
      .bind(organizationId)
      .first();

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
};

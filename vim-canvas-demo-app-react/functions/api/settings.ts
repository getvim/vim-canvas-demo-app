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
    const { theme_color, adapter_actions_enabled } = data;
    if (adapter_actions_enabled !== undefined && typeof adapter_actions_enabled !== "boolean") {
      return Response.json({ error: "Invalid Adapter Actions setting" }, { status: 400 });
    }
    const adapterActionsEnabled = adapter_actions_enabled === undefined
      ? null
      : Number(adapter_actions_enabled);

    const result = await DB.prepare(
      `INSERT INTO settings (organization_id, theme_color, created_at, adapter_actions_enabled)
       VALUES (?1, ?2, ?3, COALESCE(?4, 0))
       ON CONFLICT (organization_id) DO UPDATE SET
         theme_color = excluded.theme_color,
         adapter_actions_enabled = COALESCE(?4, settings.adapter_actions_enabled)`
    )
      .bind(organizationId, theme_color, new Date().toISOString(), adapterActionsEnabled)
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
      .first<{ adapter_actions_enabled?: number }>();

    return Response.json(result && {
      ...result,
      adapter_actions_enabled: result.adapter_actions_enabled === 1,
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
};

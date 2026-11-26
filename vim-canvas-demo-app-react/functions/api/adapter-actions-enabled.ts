import type { PublicOrganizationSettings } from "../../types";
import type { Env } from "../context-env";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const headers = { "Cache-Control": "no-store" };
  const organizationIdParam = new URL(request.url).searchParams.get("organizationId");
  const organizationId = Number(organizationIdParam);
  if (
    !organizationIdParam ||
    !/^[1-9]\d*$/.test(organizationIdParam) ||
    !Number.isSafeInteger(organizationId)
  ) {
    return Response.json({ error: "Invalid organization ID" }, { status: 400, headers });
  }

  try {
    const settings = await env.DB.prepare(
      "SELECT adapter_actions_enabled, theme_color FROM settings WHERE organization_id = ?"
    )
      .bind(organizationId)
      .first<{ adapter_actions_enabled: number; theme_color: string }>();

    const publicSettings: PublicOrganizationSettings = {
      enabled: settings?.adapter_actions_enabled === 1,
      themeColor: settings?.theme_color ?? null,
    };
    return Response.json(publicSettings, { headers });
  } catch {
    return Response.json({ error: "Organization settings are unavailable" }, { status: 503, headers });
  }
};

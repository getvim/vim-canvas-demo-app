import { Env } from "../context-env";
import { Settings } from "../../types";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const { DB } = env;

  try {
    const data = (await request.json()) as Settings;
    const { organization_id, theme_color } = data;

    const result = await DB.prepare(
      "INSERT INTO settings (organization_id, theme_color, created_at) VALUES (?, ?, ?)"
    )
      .bind(organization_id, theme_color, new Date().toISOString())
      .run();

    return Response.json({ success: true, id: result.meta.last_row_id });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
};

import { Env } from "../../context-env";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const { DB } = env;
  const url = new URL(context.request.url);
  const organizationId = url.pathname.split("/").pop();
  try {
    const { results } = await DB.prepare(
      "SELECT * FROM settings WHERE organization_id = ?"
    )
      .bind(organizationId)
      .all();

    return Response.json({
      organizationId: results[0].organization_id,
      themeColor: results[0].theme_color,
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
};

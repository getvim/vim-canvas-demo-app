import { Env } from "../../context-env";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const { DB } = env;
  const url = new URL(context.request.url);
  const organizationId = url.pathname.split("/").pop();
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

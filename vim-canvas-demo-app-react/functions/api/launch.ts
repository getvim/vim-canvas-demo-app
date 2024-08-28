export const onRequestGet: PagesFunction = async () => {
  return Response.json({
    hello: "world",
  });
};

export default async function checkApi(api: string) {
  const pubapi = process.env.pubapi;
  if (api === pubapi) {
    return;
  } else {
    return Response.json(
      { message: "ERR_TOKEN_NOT_ALLOWED" },
      {
        status: 403,
        statusText: "ERR_TOKEN_NOT_ALLOWED",
      },
    );
  }
}

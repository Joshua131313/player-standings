export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api/, "");

  const target =
    "https://jwxgzmmqae.us-east-1.awsapprunner.com" +
    path +
    url.search;

  return fetch(target, {
    method: req.method,
    headers: req.headers,
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : req.body,
  });
}

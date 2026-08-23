export async function onRequest(context) {
  const url = new URL(context.request.url);
  const targetUrl = new URL(
    url.pathname + url.search,
    'https://forqan-api.runasp.net'
  );

  const newRequest = new Request(targetUrl, context.request);
  return fetch(newRequest);
}

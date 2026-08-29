export async function onRequest(context) {
  const url = new URL(context.request.url);
  // Reconstruct the target URL for MonsterASP API
  const targetUrl = new URL(
    url.pathname + url.search,
    'https://forqan-api.runasp.net'
  );

  // Create a new request with the same method, headers, and body
  const newRequest = new Request(targetUrl, context.request);

  // Forward the request and return the response
  return fetch(newRequest);
}

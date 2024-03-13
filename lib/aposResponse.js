import config from 'virtual:apostrophe-config';
import fetch from 'node-fetch';
import { Request } from 'node-fetch';
import { Readable } from 'node:stream';

export default async function aposResponse(request) {
  // Convert the request to a node-fetch request so that we can carry out
  // redirects manually, a feature not possible in the W3C Request API
  const url = new URL(request.url);
  const aposHost = process.env.APOS_HOST || config.aposHost;
  const aposUrl = new URL(url.pathname, aposHost);
  aposUrl.search = url.search;
  const headers = {
    ...Object.fromEntries([...request.headers.entries()])
  };
  const aposRequest = new Request(aposUrl.href, {
    method: request.method,
    body: request.body && Readable.fromWeb(request.body),
    headers,
    redirect: 'manual'
  });
  const response = await fetch(aposRequest);
  if ((response.status === 301) || (response.status === 302)) {
    try {
      let location = response.headers.get('location');
      if (location.startsWith('/')) {
        location = `${aposHost}${location}`;
      }
      const redirectUrl = new URL(location);
      if (redirectUrl.host === aposHost) {
        // Let Astro consider each internal redirect and whether it should be proxied
        redirectUrl.host = request.headers.host;
        return new Response(null, {
          status: response.status,
          statusText: response.statusText,
          headers: {
            location: redirectUrl.toString()
          }
        });
      }
    } catch (e) {
      console.error('aposResponse error:', e);
      throw e;
    }
  }
  // Honor non-redirect responses and redirects to third sites
  return response;
};

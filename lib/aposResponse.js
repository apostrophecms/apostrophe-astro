import config from 'virtual:apostrophe-config';
import fetch from 'node-fetch';
import { Request } from 'node-fetch';
import { Readable } from 'node:stream';

export default async function aposResponse(request, { redirect = null } = {}) {
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
        const webHeaders = toWebHeaders(response.headers);
        webHeaders.set('location', redirectUrl.toString());
        const args = {
          status: response.status,
          statusText: response.statusText,
          headers
        };
        return new Response(null, args);
      }
    } catch (e) {
      console.error('aposResponse error:', e);
      throw e;
    }
  }
  // Honor non-redirect responses and redirects to third sites
  return toWebResponse(response);
};

function toWebResponse(nodeResponse) {
  if ((nodeResponse.status === 301) || (nodeResponse.status === 302)) {
    // Attempts to construct a Response object with a redirect status throw an error,
    // but Astro provides its own alternative
    console.log('---> Constructing redirect to:', nodeResponse.headers.location);
    return Astro.redirect(nodeResponse.headers.location, nodeResponse.status);
  }
  try {
    const headers = toWebHeaders(nodeResponse.headers);
    console.log('>>>', nodeResponse.status, nodeResponse.body);
    const response = new Response(
      (nodeResponse.status !== 304) && nodeResponse.body && Readable.toWeb(nodeResponse.body),
      {
        status: nodeResponse.status,
        statusText: nodeResponse.statusText,
        headers
      }
    );
    return response;
  } catch (e) {
    console.error('toWebResponse error:', e);
    throw e;
  }
}

function toWebHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [ key, ] of nodeHeaders.entries()) {
    for (const val of nodeHeaders.getAll(key)) {
      headers.set(key, val);
    }
  }
  return headers;
}

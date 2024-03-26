import config from 'virtual:apostrophe-config';
import fetch from 'node-fetch';
import { Request } from 'node-fetch';
import { Readable } from 'node:stream';

export default async function aposResponse(request, { manualRedirect = null } = {}) {
  // Convert the request to a node-fetch request so that we can carry out
  // redirects manually, a feature not possible in the W3C Request API
  const url = new URL(request.url);
  const aposHost = process.env.APOS_HOST || config.aposHost;
  const aposUrl = new URL(url.pathname, aposHost);
  aposUrl.search = url.search;
  const headers = {
    ...Object.fromEntries([...request.headers.entries()])
  };
  if (manualRedirect) {
    // The manual redirect feature is only used by the proxy mechanism, which
    // also requires cache busting to avoid a 304 response as we are forbidden
    // to construct a Response object with a 304
    headers['cache-control'] = 'no-cache';
  }
  const aposRequest = new Request(aposUrl.href, {
    method: request.method,
    body: request.body && Readable.fromWeb(request.body),
    headers,
    // We can only intercept redirects if we were given the means to
    // construct one
    redirect: manualRedirect ? 'manual' : 'follow'
  });
  const response = await fetch(aposRequest);
  if ((response.status === 301) || (response.status === 302)) {
    try {
      let location = response.headers.get('location');
      if (location.startsWith('/')) {
        const url = new URL(location, request.url);
        url.host = request.headers.get('host');
        location = url.toString();
      }
      const redirectUrl = new URL(location);
      if (redirectUrl.host === aposHost) {
        // Let Astro consider each internal redirect and whether it should be proxied
        redirectUrl.host = request.headers.host;
      }
      const redirectUrlString = redirectUrl.toString();
      return manualRedirect(redirectUrlString, response.status);
    } catch (e) {
      // Difficult to debug if not logged here
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
    return Astro.redirect(nodeResponse.headers.location, nodeResponse.status);
  }
  try {
    const headers = toWebHeaders(nodeResponse.headers);
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
    // Difficult to debug if not logged here
    console.error('toWebResponse error:', e);
    throw e;
  }
}

// Necessary to handle cases where the same header is sent twice,
// e.g. Set-Cookie. Otherwise the first login attempt in a given
// window will not "stick" (as seen in incognito window)

function toWebHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [ key, ] of nodeHeaders.entries()) {
    for (const val of nodeHeaders.getAll(key)) {
      headers.set(key, val);
    }
  }
  return headers;
}

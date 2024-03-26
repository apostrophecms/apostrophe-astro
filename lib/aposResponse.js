import config from 'virtual:apostrophe-config';
import { request } from 'undici';

export default async function aposResponse(req) {
  const url = new URL(req.url);
  const aposHost = process.env.APOS_HOST || config.aposHost;
  const aposUrl = new URL(url.pathname, aposHost);
  aposUrl.search = url.search;

  const headers = {}
  for (const header of req.headers) {
    headers[header[0]] = header[1];
  }
  const res = await request(aposUrl.href, { headers, method: req.method, body: req.body });
  const response = new Response(res.body, res);
  return response;
};


import aposResponse from './aposResponse.js';

export default async function aposPageFetch(req) {
  const key = process.env.APOS_EXTERNAL_FRONT_KEY;
  if (!key) {
    throw new Error('APOS_EXTERNAL_FRONT_KEY environment variable must be set,\nhere and in the Apostrophe app');
  }
  let aposData = {};
  try {
    const request = new Request(req);
    request.headers.set('x-requested-with', 'AposExternalFront');
    request.headers.set('apos-external-front-key', key);
    const response = await aposResponse(request);
    aposData = await response.json();
    aposData.aposResponseHeaders = response.headers;
    if (aposData.template === '@apostrophecms/page:notFound') {
      aposData.notFound = true;
    }
  } catch (e) {
    console.error('aposPageFetch error:', e);
    aposData.errorFetchingPage = e;
    aposData.page = {
      type: 'apos-fetch-error'
    };
  }
  return aposData;
}
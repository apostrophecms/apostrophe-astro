import aposResponse from './aposResponse.js';
import aposRequest from './aposRequest.js';

export default async function aposPageFetch(req) {
  let aposData = {};

  try {
    const request = aposRequest(req);
    const response = await aposResponse(request);

    const isJsonResponse = response.headers
      .get("Content-Type")
      .includes("application/json");

    if (!isJsonResponse) {
      const text = await response.text();

      if (response.status >= 400) {
        throw new Error(text);
      }

      return new Response(text, {
        status: response.status,
        headers: response.headers
      });
    }

    aposData = await response.json();
    aposData.aposResponseHeaders = response.headers;

    if (aposData.template === '@apostrophecms/page:notFound') {
      aposData.notFound = true;
    }
  } catch (error) {
    console.error(error);
    aposData.errorFetchingPage = error;
    aposData.page = {
      type: 'apos-fetch-error'
    };
  }

  return aposData;
}


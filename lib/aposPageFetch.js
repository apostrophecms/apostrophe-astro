import aposResponse from './aposResponse.js';
import aposRequest from './aposRequest.js';

export default async function aposPageFetch(req) {
  let aposData = {};
  try {
    const request = aposRequest(req);
    const response = await aposResponse(request);
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
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


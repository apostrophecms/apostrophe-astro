import proxy from "../lib/proxy";
import aposRequest from "../lib/aposRequest";

export async function ALL({ params, request, redirect }) {
  console.log(`external frontend proxy: ${request.url}`);
  request = aposRequest(request);
  return proxy({ params, request, redirect });
};

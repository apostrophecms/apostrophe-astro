import aposResponse from "../lib/aposResponse";

export async function ALL({ params, request }) {
  try {
    return await aposResponse(request);
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
};

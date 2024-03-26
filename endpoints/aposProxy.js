import aposResponse from "../lib/aposResponse";

export async function ALL({ params, request, redirect }) {
  try {
    return await aposResponse(request, { redirect });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
};

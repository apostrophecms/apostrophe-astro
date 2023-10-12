import aposResponse from "../lib/aposResponse"

export async function ALL({ params, request }) {
    let response
    try {
      response = await aposResponse(request)
    } catch (e) {
      response = new Response(e.message, { status: 500 })
    }
    return response
  }
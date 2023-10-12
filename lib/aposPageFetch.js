import aposResponse from "./aposResponse";

export default async function aposPageFetch(url) {
    let aposData = {}
    try {
        const request = new Request(url)
        request.headers.set('x-requested-with', 'ExternalFront')
        const response = await aposResponse(request)
        aposData = await response.json()
        aposData.aposResponseHeaders = response.headers
    } catch (e) {
        aposData.errorFetchingPage = e
        aposData.page = {
            type: 'apos-fetch-error'
        }
    }
    return aposData
}
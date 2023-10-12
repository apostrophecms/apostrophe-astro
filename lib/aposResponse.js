import config from 'virtual:apostrophe-config'

export default async function aposResponse(request) {
    const url = new URL(request.url)
    const aposHost = process.env.APOS_HOST || config.aposHost
    const aposUrl = new URL(url.pathname, aposHost)
    aposUrl.search = url.search
    const aposRequest = new Request(aposUrl.href, request)
  
    const response = await fetch(aposRequest)
    return response;
}
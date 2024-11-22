
import { getCookie } from 'cookies-next';

export async function fetchApi(path: string, init?: RequestInit, noContentType?: boolean) {
  const cookie = getCookie('next-auth.session-token');

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  const url = new URL(path, baseUrl)


  const headers: any = { 'Authorization': `Bearer ${cookie}`}

  if(!noContentType) {
    headers['Content-type'] = 'application/json'
  } 


  return fetch(url, { ...init, headers, }).catch(err => err)
}
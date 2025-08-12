import { cache } from 'react'

export const fetchWithCache = cache(async (url: string) => {
  const res = await fetch(url)
  return res.json()
})

export async function fetchContent(lat: number, lon: number, explore: boolean = false) {
  return fetchWithCache(`/api/content?lat=${lat}&lon=${lon}${explore ? '&explore=true' : ''}`)
}

export async function postContent(formData: FormData) {
  const res = await fetch('/api/content', {
    method: 'POST',
    body: formData,
  })
  return res.json()
}

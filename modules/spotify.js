import fetch from 'isomorphic-fetch'
import { trackLimit } from './constants'

const apiUrl = 'https://api.spotify.com/v1'

const accountsUrl = 'https://accounts.spotify.com/authorize'
const client = 'client_id=66262c3ee763474a87027a6d30508de0'
const redirect = 'redirect_uri=http://localhost:3000'
const responseType = 'response_type=token'
const scopes = 'scope=user-top-read playlist-modify-private'
export const authorizeHref = `${accountsUrl}?${client}&${redirect}&${responseType}&${scopes}`

export const getToken = (hash) => {
  const regexp = /.access_token=(.*)&token_type.*/g
  const match = regexp.exec(hash)
  if (match) {
    return match[1]
  }
  return null
}

const getHeaders = token => ({ Authorization: `Bearer ${token}` })

export const getTopTracks = (token, range = 'medium_term', limit = trackLimit) =>
  fetch(`${apiUrl}/me/top/tracks?time_range=${range}&limit=${limit}`, {
    headers: getHeaders(token),
  }).then(x => x.json())

export const getPlaylists = token =>
  fetch(`${apiUrl}/me/playlists`, {
    headers: getHeaders(token),
  }).then(x => x.json())

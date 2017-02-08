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

const getHeaders = token => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
})

export const getUserId = token =>
  fetch(`${apiUrl}/me`, {
    headers: getHeaders(token),
  }).then(x => x.json()).then(x => x.id)

export const getTopTracks = (token, range = 'medium_term', limit = trackLimit) =>
  fetch(`${apiUrl}/me/top/tracks?time_range=${range}&limit=${limit}`, {
    headers: getHeaders(token),
  }).then(x => x.json())

export const createPlaylist = (token, userId, name, tracks) =>
  fetch(`${apiUrl}/users/${userId}/playlists`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({
      name,
      public: false, // private playlist
    }),
  }).then(x => x.json())
  .then((response) => {
    const playlistId = response.id
    fetch(`${apiUrl}/users/${userId}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        uris: tracks.map(track => track.uri),
      }),
    })
  })

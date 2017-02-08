const base = 'https://accounts.spotify.com/authorize'
const client = 'client_id=66262c3ee763474a87027a6d30508de0'
const redirect = 'redirect_uri=http://localhost:3000'
const responseType = 'response_type=token'
const scopes = 'scope=user-top-read playlist-modify-private'
export const authorizeHref = `${base}?${client}&${redirect}&${responseType}&${scopes}`

export const getToken = (hash) => {
  const regexp = /.access_token=(.*)&token_type.*/g
  const match = regexp.exec(hash)
  if (match) {
    return match[1]
  }
  return null
}

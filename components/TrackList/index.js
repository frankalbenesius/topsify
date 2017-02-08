import React from 'react'
import { css } from 'glamor'

const styles = css({
  textAlign: 'left',
  width: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const linkStyles = css({
  textDecoration: 'none',
  color: 'black',
  ':hover': {
    textDecoration: 'underline',
    color: '#1DB954',
  },
})

const Track = ({ track }) => (
  <div className={styles}>
    <a title="Open in Spotify" className={linkStyles} href={track.uri}>{track.name}</a>
  </div>
)

const TrackList = ({ tracks }) => (
  <div>
    {tracks.map(track => (
      <Track key={track.id} track={track} />
    ))}
  </div>
)

export default TrackList

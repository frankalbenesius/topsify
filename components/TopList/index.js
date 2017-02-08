import React from 'react'
import { css } from 'glamor'

const listStyles = css({
  display: 'inline-block',
  width: '33%',
  minWidth: '15rem',
  verticalAlign: 'top',
  textAlign: 'left',
})

const itemStyles = css({
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
  <div className={itemStyles}>
    <a title="Open in Spotify" className={linkStyles} href={track.uri}>{track.name}</a>
  </div>
)

const TopList = ({ tracks, children }) => (
  <div className={listStyles}>
    {children ? (
      <h2>{children}</h2>
    ) : null}
    {tracks.map(track => (
      <Track key={track.id} track={track} />
    ))}
  </div>
)

export default TopList

import React from 'react'
import { css } from 'glamor'

const styles = css({
  display: 'inline-block',
  margin: '1rem',
  maxWidth: '20rem',
})

const TopList = ({ tracks, children }) => (
  <div className={styles}>
    <h2>{children}</h2>
    {tracks.map(track => (
      <div key={track.id}>{track.name}</div>
    ))}
  </div>
)

export default TopList

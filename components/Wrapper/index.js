import React from 'react'
import Head from 'next/head'
import { css } from 'glamor'

const styles = css({
  padding: '1rem',
  width: '100%',
  maxWidth: '50rem',
  textAlign: 'left',
  margin: '0 auto',
})

const Wrapper = ({ children }) => (
  <div className={styles}>
    <Head>
      <title>Spotify Top Tracks</title>
      <link rel="stylesheet" type="text/css" href="static/main.css" />
    </Head>
    {children}
  </div>
)

export default Wrapper

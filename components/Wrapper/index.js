import React from 'react'
import Head from 'next/head'
import { css } from 'glamor'

const styles = css({
  maxWidth: '52rem',
  padding: '1rem 2rem',
  width: '100%',
  textAlign: 'left',
  margin: '0 auto',
  backgroundColor: 'white',
  '@media(min-width: 54rem)': {
    margin: '2rem auto',
  },
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

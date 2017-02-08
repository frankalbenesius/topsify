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

const footerStyles = css({
  marginTop: '4rem',
})

const Wrapper = ({ children }) => (
  <div className={styles}>
    <Head>
      <title>Spotify Top Tracks</title>
      <link rel="stylesheet" type="text/css" href="static/main.css" />
    </Head>
    {children}
    <footer className={footerStyles}>
      Made by <a href="http://albenesi.us">Frank Albenesius</a> with the <a href="https://developer.spotify.com/web-api/">Spotify Web API</a>.
    </footer>
  </div>
)

export default Wrapper

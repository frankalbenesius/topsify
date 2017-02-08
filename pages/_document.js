import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { renderStatic } from 'glamor/server'

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }) {
    const page = renderPage()
    const styles = renderStatic(() => page.html)
    return { ...page, ...styles }
  }

  /* eslint-disable react/no-danger */
  render() {
    return (
      <html lang="en">
        <Head>
          <title>Spotify Top Tracks</title>
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
          <link rel="stylesheet" type="text/css" href="static/main.css" />
          <meta charSet="utf-8" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

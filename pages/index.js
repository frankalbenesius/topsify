/* global window */
import React from 'react'
import Head from 'next/head'

import { authorizeHref, getToken, getTopTracks } from '../modules/spotify'

import TopList from '../components/TopList'

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pending: true,
    }
  }
  componentDidMount() {
    const token = getToken(window.location.hash)
    if (token) {
      this.setState({ // eslint-disable-line
        authorized: true,
        token,
      })
    } else {
      this.setState({ // eslint-disable-line
        authorized: false,
        pending: false,
      })
    }
  }
  componentDidUpdate() {
    if (this.state.token && !this.state.tracks) {
      Promise.all([
        getTopTracks(this.state.token, 'long_term'),
        getTopTracks(this.state.token, 'medium_term'),
        getTopTracks(this.state.token, 'short_term'),
      ]).then((response) => {
        this.setState({
          tracks: {
            long: response[0].items,
            medium: response[1].items,
            short: response[2].items,
          },
          pending: false,
        })
      }, (error) => {
        this.setState({ error, pending: false })
      })
    }
  }
  render() {
    // admittedly hacky state management, sorry
    let content
    if (this.state.error) {
      content = <div>Sorry! Something went wrong.</div>
    } else if (this.state.pending) {
      content = <div>Loading ...</div>
    } else if (!this.state.authorized) {
      content = <a href={authorizeHref}>Authorize With Spotify</a>
    } else {
      // not pending and definitely authorized, should have tracks!
      content = (
        <div>
          <TopList tracks={this.state.tracks.long}>Long</TopList>
          <TopList tracks={this.state.tracks.medium}>Medium</TopList>
          <TopList tracks={this.state.tracks.short}>Short</TopList>
        </div>
      )
    }
    return (
      <div>
        <Head>
          <title>Topsify</title>
          <link rel="stylesheet" type="text/css" href="static/main.css" />
        </Head>
        <h1>TOPSIFY</h1>
        {content}
      </div>
    )
  }
}

export default IndexPage

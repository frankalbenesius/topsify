/* global window */
import React from 'react'

import { authorizeHref, getToken, getTopTracks } from '../modules/spotify'

import Wrapper from '../components/Wrapper'
import TopList from '../components/TopList'
import Logo from '../components/Logo'

const presentIn = trackIds => track => trackIds.indexOf(track.id) > -1
const getSpecialTracks = (trackLists) => {
  const long = trackLists[0].items
  const mediumIds = trackLists[1].items.map(x => x.id)
  const shortIds = trackLists[2].items.map(x => x.id)
  return long.filter(presentIn(mediumIds)).filter(presentIn(shortIds))
}

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
            special: getSpecialTracks(response),
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
          <h2>These are your top 20 tracks from the last few:</h2>
          <div>
            <TopList tracks={this.state.tracks.short} playlist >Weeks</TopList>
            <TopList tracks={this.state.tracks.medium} playlist >Months</TopList>
            <TopList tracks={this.state.tracks.long} playlist >Years</TopList>
          </div>
          {this.state.tracks.special.length > 0 ? (
            <div>
              <h2>{'Tracks that transcend time:'}</h2>
              <TopList tracks={this.state.tracks.special} />
            </div>
          ) : null}
        </div>
      )
    }
    return (
      <Wrapper>
        <Logo />
        <h1>Review Your Top Tracks</h1>
        {content}
      </Wrapper>
    )
  }
}

export default IndexPage

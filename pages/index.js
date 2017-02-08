/* global window */
import React from 'react'
import format from 'date-fns/format'

import { trackLimit } from '../modules/constants'
import {
  authorizeHref,
  getToken,
  getUserId,
  getTopTracks,
  createPlaylist,
} from '../modules/spotify'

import Button from '../components/Button'
import Column from '../components/Column'
import Wrapper from '../components/Wrapper'
import TrackList from '../components/TrackList'
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
    this.createPlaylistHandler = this.createPlaylistHandler.bind(this)
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
        getUserId(this.state.token),
      ]).then((response) => {
        this.setState({
          tracks: {
            long: response[0].items,
            medium: response[1].items,
            short: response[2].items,
            special: getSpecialTracks(response),
          },
          userId: response[3],
          pending: false,
        })
      }, (error) => {
        this.setState({ error, pending: false })
      })
    }
  }
  createPlaylistHandler(range, tracks) {
    const prettyDate = format(new Date(), 'MM/DD/YY') // for playlist names
    return () => {
      createPlaylist(this.state.token, this.state.userId, `Last Few ${range} - ${prettyDate}`, tracks)
    }
  }
  render() {
    // admittedly hacky state management, sorry
    // a more production-ready application could have several wrapper components
    // that check for each of these boolean states independently
    let content
    if (this.state.error) {
      content = <div>Sorry! Something went wrong.</div>
    } else if (this.state.pending) {
      content = <div>Loading ...</div>
    } else if (!this.state.authorized) {
      content = (
        <div>
          <p>In order to see your top tracks, you must authorize this site through Spotify.</p>
          <a href={authorizeHref}><Button>Authorize With Spotify</Button></a>
        </div>
      )
    } else {
      // not pending and definitely authorized, should have tracks!
      content = (
        <div>
          <h2>These are your top {trackLimit} tracks from the last few:</h2>
          <div>
            <Column>
              <h2>Weeks</h2>
              <TrackList tracks={this.state.tracks.short} />
              <Button
                onClick={this.createPlaylistHandler('Weeks', this.state.tracks.short)}
              >
                Create Playlist
              </Button>
            </Column>
            <Column>
              <h2>Months</h2>
              <TrackList tracks={this.state.tracks.medium} />
              <Button
                onClick={this.createPlaylistHandler('Months', this.state.tracks.medium)}
              >
                Create Playlist
              </Button>
            </Column>
            <Column>
              <h2>Years</h2>
              <TrackList tracks={this.state.tracks.long} />
              <Button
                onClick={this.createPlaylistHandler('Years', this.state.tracks.long)}
              >
                Create Playlist
              </Button>
            </Column>
          </div>
          {this.state.tracks.special.length > 0 ? (
            <div>
              <h2>{'Tracks that transcend time:'}</h2>
              <TrackList tracks={this.state.tracks.special} />
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

/* global window */
import React from 'react'
import format from 'date-fns/format'

import { trackLimit } from '../modules/constants'
import {
  getAuthorizeHref,
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
const getSpecialTracks = (tracklists) => {
  const long = tracklists[0].items
  const mediumIds = tracklists[1].items.map(x => x.id)
  const shortIds = tracklists[2].items.map(x => x.id)
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
    if (this.state.token && !this.state.tracklists) {
      Promise.all([
        getTopTracks(this.state.token, 'short_term'),
        getTopTracks(this.state.token, 'medium_term'),
        getTopTracks(this.state.token, 'long_term'),
        getUserId(this.state.token),
      ]).then((response) => {
        this.setState({
          tracklists: {
            short: {
              id: 'short',
              display: 'Weeks',
              items: response[0].items,
              playlistCreated: false,
            },
            medium: {
              id: 'medium',
              display: 'Months',
              items: response[1].items,
              playlistCreated: false,
            },
            long: {
              id: 'long',
              display: 'Years',
              items: response[2].items,
              playlistCreated: false,
            },
          },
          tracklistsOrder: ['short', 'medium', 'long'],
          special: getSpecialTracks(response),
          userId: response[3],
          pending: false,
        })
      }, (error) => {
        this.setState({ error, pending: false })
      })
    }
  }
  createPlaylistHandler(tracklist) {
    const prettyDate = format(new Date(), 'MM/DD/YY') // for playlist names
    return () => {
      // gosh this is contrived, but it is starting to resemble a reducer :/
      this.setState({
        tracklists: {
          ...this.state.tracklists,
          [tracklist.id]: {
            ...tracklist,
            playlistCreated: true,
          },
        },
      }, () => createPlaylist(this.state.token, this.state.userId, `Last Few ${tracklist.display} - ${prettyDate}`, tracklist.items))
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
          <a href={getAuthorizeHref(window.location.origin)}>
            <Button>Authorize With Spotify</Button>
          </a>
        </div>
      )
    } else {
      // not pending and definitely authorized, should have tracks!
      content = (
        <div>
          <h2>These are your top {trackLimit} tracks from the last few</h2>
          <div>
            {this.state.tracklistsOrder.map(id => this.state.tracklists[id]).map(tracklist => (
              <Column key={tracklist.display}>
                <h2>{tracklist.display}</h2>
                <TrackList tracks={tracklist.items} />
                {tracklist.playlistCreated ? (
                  <Button disabled>
                    Playlist Created!
                  </Button>
                ) : (
                  <Button onClick={this.createPlaylistHandler(tracklist)}>
                    Create Playlist
                  </Button>
                )}
              </Column>
            ))}
          </div>
          {this.state.special.length > 0 ? (
            <div>
              <h2>{'Tracks That Transcend Time'}</h2>
              <TrackList tracks={this.state.special} />
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

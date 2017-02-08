/* global window */
import React from 'react'
import { authorizeHref, getToken } from '../modules/spotify'

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      authorized: false,
    }
  }
  componentDidMount() {
    const token = getToken(window.location.hash)
    if (token) {
      this.setState({ // eslint-disable-line
        authorized: true,
        token,
      })
    }
  }
  render() {
    return (
      <div>
        <h1>TOPSIFY</h1>
        {this.state.authorized ? (
          <p>Nice, authorized</p>
        ) : (
          <a href={authorizeHref}>Authorize With Spotify</a>
        )}
      </div>
    )
  }
}

export default IndexPage

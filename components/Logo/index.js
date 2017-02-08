import React from 'react'
import { css } from 'glamor'

const wrapperStyles = css({
  maxWidth: '15rem',
})
const imgStyles = css({
  width: '100%',
  margin: '1rem 0',
})

const Logo = () => (
  <div className={wrapperStyles}>
    <img className={imgStyles} alt="spotify logo" src="static/logo.png" />
  </div>
)

export default Logo

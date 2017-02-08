import React from 'react'
import { css } from 'glamor'
import { brandColor, brandColorDark } from '../../modules/constants'

const styles = css({
  borderRadius: '0.4rem',
  backgroundColor: brandColor,
  color: 'white',
  border: '0',
  padding: '0.4rem 1rem',
  fontSize: '1.1rem',
  outline: '0',
  margin: '1rem 0 0.25rem',
  ':hover': {
    backgroundColor: brandColorDark,
  },
})

const Logo = ({ children, onClick }) => (
  <button onClick={onClick} className={styles}>{children}</button>
)

export default Logo

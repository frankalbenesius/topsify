import React from 'react'
import { css } from 'glamor'

const styles = css({
  display: 'inline-block',
  width: '33.3333%',
  minWidth: '15rem',
  verticalAlign: 'top',
  textAlign: 'left',
})
const Column = ({ children }) => (
  <div className={styles}>
    {children}
  </div>
)

export default Column

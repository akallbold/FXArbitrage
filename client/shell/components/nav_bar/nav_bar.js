import React from 'react'
import Styles from './nav_bar.css'

const onFeedbackClick = () => window.zE && window.zE.activate()

const NavBar = () => (
  <nav className={Styles.navbar}>
    <ul className={Styles.container}>
      <li className={Styles.left}>
        list item
      </li>
      <li className={Styles.middle}>
        middle
      </li>
      <li className={Styles.right}>
        right
      </li>
      <li className={Styles.right}>
        <Button className={Styles.feedback} onClick={onFeedbackClick}>
          button
        </Button>
      </li>
    </ul>
  </nav>
)

export default NavBar

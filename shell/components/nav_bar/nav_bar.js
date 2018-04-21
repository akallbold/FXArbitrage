import React from 'react'
import { Hyfn8Logo, Button, Megaphone } from 'playa-styleguide'
import AccountMenu from 'components/account_menu/account_menu'
import BrandSwitcher from 'components/brand_switcher/brand_switcher'
import Styles from './nav_bar.css'

const onFeedbackClick = () => window.zE && window.zE.activate()

const NavBar = () => (
  <nav className={Styles.navbar}>
    <ul className={Styles.container}>
      <li className={Styles.left}>
        <Hyfn8Logo className={Styles.logo} />
      </li>
      <li className={Styles.middle}>
        <BrandSwitcher />
      </li>
      <li className={Styles.right}>
        <AccountMenu />
      </li>
      <li className={Styles.right}>
        <Button className={Styles.feedback} onClick={onFeedbackClick}>
          <Megaphone />
        </Button>
      </li>
    </ul>
  </nav>
)

export default NavBar

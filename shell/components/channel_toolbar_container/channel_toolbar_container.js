import React from 'react'
import { ActionButton } from 'components/toolbar_action_button'
import ChannelToolbarArrowBox from 'components/channel_toolbar_arrow_box'
import ConnectedBreadCrumb from 'components/bread_crumb/bread_crumb'
import Styles from './channel_toolbar_container.css'
import SideNavToggler from 'components/side_nav_toggler/side_nav_toggler'

const ChannelToolbarContainer = () => (
  <div className={Styles.channelToolbarContainer}>
    <div className={Styles.channelToolbar}>
      <ChannelToolbarArrowBox />
      <ConnectedBreadCrumb />
      <div className={Styles.actionButton}><ActionButton /></div>
    </div>
    <SideNavToggler />
  </div>
)

export default ChannelToolbarContainer

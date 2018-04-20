import React from 'react'
import { connect } from 'react-redux'
import * as actions from 'actions/side_nav_actions'
import Styles from './side_nav.css'
import PlatformStatusView from './platform_status/platform_status'
import LibraryView from './library/library'

const SideNav = ({ showSideNav }) => (
  <div className={`${Styles.container} ${showSideNav ? '' : Styles.hide}`}>
    <div className={Styles.sideNav}>
      <PlatformStatusView />
      <br />
      <LibraryView />
    </div>
  </div>
)

const mapStateToProps = state => ({
  showSideNav: state.sideNav.showSideNav
})

const SideNavConnected = connect(
  mapStateToProps,
  actions
)(SideNav)

export default SideNavConnected

import React from 'react'
import PropTypes from 'prop-types'
import { Fragment } from 'redux-little-router'
import { subAppRoots } from 'sub_apps'
import { CheckBrandChannelActive } from 'components/brand_inactive_channel'
import SideNav from 'components/side_nav/side_nav'
import { CatchAllPage } from 'components/catch_all_page'
import Styles from './content_container.css'

const noop = () => (null)
const {
  SnapChat = noop,
  Twitter = noop,
  Facebook = noop,
  Pinterest = noop
} = subAppRoots

const ContentContainer = ({ showErrorPage }) => (
  <div className={Styles.contentContainer}>
    <div className={Styles.expandableContainer}>
      {showErrorPage &&
        <CatchAllPage />
      }
      {!showErrorPage &&
        <CheckBrandChannelActive>
          <Fragment forRoute='/'>
            <div>
              <SnapChat />
              <Twitter />
              <Facebook />
              <Pinterest />
            </div>
          </Fragment>
        </CheckBrandChannelActive>
      }
    </div>
    <SideNav />
  </div>
)

ContentContainer.propTypes = {
  showErrorPage: PropTypes.bool
}

ContentContainer.defaultProps = {
  showErrorPage: false
}

export default ContentContainer

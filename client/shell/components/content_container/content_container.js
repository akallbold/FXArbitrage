import React from 'react'
import PropTypes from 'prop-types'
import { Fragment } from 'redux-little-router'
import Styles from './content_container.css'

const noop = () => (null)

const ContentContainer = ({ showErrorPage }) => (
  <div className={Styles.contentContainer}>
    <div className={Styles.expandableContainer}>
      {!showErrorPage &&
        <Fragment forRoute='/'>
          <div>
            <SnapChat />
            <Twitter />
            <Facebook />
            <Pinterest />
          </div>
        </Fragment>
      }
    </div>
  </div>
)

ContentContainer.propTypes = {
  showErrorPage: PropTypes.bool
}

ContentContainer.defaultProps = {
  showErrorPage: false
}

export default ContentContainer

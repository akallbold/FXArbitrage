import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'redux-little-router'

import {
  curBrandSelector,
  curChannelSelector
} from 'selectors/platform_selectors'

import { brandChannels } from 'selectors/org_selectors'

import { PLATFORM_NAMES } from 'constants/platform'
import { TwitterIcon, FacebookIcon, SnapchatIcon, PinterestIcon } from 'playa-styleguide'
import Styles from './platform_status.css'

export const platformLinkData = [
  {
    id: PLATFORM_NAMES.FACEBOOK,
    url: '/facebook',
    label: 'Facebook',
    icon: <FacebookIcon />
  },
  {
    id: PLATFORM_NAMES.TWITTER,
    url: '/twitter',
    label: 'Twitter',
    icon: <TwitterIcon />
  },
  {
    id: PLATFORM_NAMES.PINTEREST,
    url: '/pinterest',
    label: 'Pinterest',
    icon: <PinterestIcon />
  },
  {
    id: PLATFORM_NAMES.SNAPCHAT,
    url: '/snapchat',
    label: 'Snapchat',
    icon: <SnapchatIcon />
  }
]

export const platformClickHandler = ({ selectedChannel, channelName }) => {
  if (selectedChannel === channelName) {
    return e => (e.preventDefault())
  }
  return null
}

export const PlatformStatusItem = ({ url, label, icon, status, current, handlePlatformClick }) => (
  <Link
    href={url}
    className={`${Styles.item} ${current && Styles.itemActive}`}
    onClick={handlePlatformClick}
  >
    <div className={Styles.itemContent}>
      <span className={Styles.icon}>{ icon }</span>
      <span className={Styles.name} data-field='name'>{label}</span>
      {status === true && <span className={`${Styles.status}`} />}
    </div>
  </Link>
)

export const PlatformStatus = ({ platformStatuses, currentBrandId, selectedChannel }) => {
  const baseUrl = `/brands/${currentBrandId}`
  const PlatformItems = platformLinkData.map(item => (
    <PlatformStatusItem
      {...item}
      current={item.label.toLowerCase() === selectedChannel}
      url={`${baseUrl}${item.url}/manager/campaigns`}
      status={platformStatuses[item.id]}
      key={item.id}
      handlePlatformClick={platformClickHandler({ selectedChannel, channelName: item.id })}
    />
  ))

  return (
    <div>
      <div className={Styles.heading}>Platforms</div>
      { PlatformItems }
    </div>
  )
}

PlatformStatus.propTypes = {
  platformStatuses: PropTypes.shape({
    currentPlatform: PropTypes.string,
    facebook: PropTypes.bool,
    snapchat: PropTypes.bool,
    twitter: PropTypes.bool,
    pinterest: PropTypes.bool,
    error: PropTypes.string,
    loading: PropTypes.bool
  }).isRequired,
  currentBrandId: PropTypes.string,
  selectedChannel: PropTypes.string
}

PlatformStatus.defaultProps = {
  platformStatuses: null,
  currentBrandId: null,
  selectedChannel: null
}

PlatformStatusItem.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  status: PropTypes.bool
}

PlatformStatusItem.defaultProps = {
  icon: null,
  status: false
}

const mapStateToProps = state => ({
  platformStatuses: brandChannels(state),
  currentBrandId: curBrandSelector(state),
  selectedChannel: curChannelSelector(state)
})

export default connect(mapStateToProps)(PlatformStatus)

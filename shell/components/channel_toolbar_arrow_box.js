import React from 'react'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import {
  TwitterIcon,
  FacebookIcon,
  SnapchatIcon,
  PinterestIcon,
  InstagramIcon
} from 'playa-styleguide'
import { brandChannelsArray, currentPageTitleSelector } from 'selectors/org_selectors'
import { curChannelSelector } from 'selectors/platform_selectors'
import Styles from './channel_toolbar_arrow_box.css'
import { SNAPCHAT, TWITTER, FACEBOOK, PINTEREST, INSTAGRAM } from './shared_constants'

const channelIcons = {
  [SNAPCHAT]: <SnapchatIcon className={Styles.snapchatIcon} viewBox='0 0 18 17' preserveAspectRatio='xMidYMid' />,
  [TWITTER]: <TwitterIcon className={Styles.twitterIcon} />,
  [FACEBOOK]: <FacebookIcon className={Styles.facebookIcon} viewBox='0 0 8 15' preserveAspectRatio='xMidYMid' />,
  [PINTEREST]: <PinterestIcon className={Styles.pinterestIcon} />,
  [INSTAGRAM]: <InstagramIcon className={Styles.instagramIcon} viewBox='0 0 15 15' preserveAspectRatio='xMidYMid' />
}

export const ArrowBox = ({ channel, activeChannels, title }) => (
  <div className={Styles.wrapper}>
    <div className={`${Styles[channel]} ${Styles.box} ${Styles.colorIcon}`}>
      {channelIcons[channel] || null}
      {channel === FACEBOOK && channelIcons[INSTAGRAM]}
    </div>
    <div className={Styles.otherActiveChannels}>
      {
        activeChannels.map((channelName) => {
          if (
            channelName !== channel && // Do not show icon on it's own channel.
            !(channelName === INSTAGRAM && channel === FACEBOOK) // Don't show snapchat on facebook
          ) {
            return (
              <div key={channelName} className={`${Styles.greyIcon}`}>
                {channelIcons[channelName] || null}
              </div>
            )
          }
          return null
        })
      }
    </div>

    {title && <h1 className={Styles.title}>{title}</h1>}
  </div>
)

ArrowBox.defaultProps = {
  channel: 'facebook'
}

const { string, arrayOf } = PropTypes

ArrowBox.propTypes = {
  channel: string,
  activeChannels: arrayOf(string).isRequired
}

const mapStateToProps = state => ({
  channel: curChannelSelector(state),
  activeChannels: brandChannelsArray(state),
  title: currentPageTitleSelector(state)
})

export default connect(mapStateToProps)(ArrowBox)

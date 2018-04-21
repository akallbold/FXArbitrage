import React from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import { connect } from 'react-redux'
import { Button, Modal, SpinnerModalContent } from 'playa-styleguide'
import { curChannelSelector } from 'selectors/platform_selectors'
import { orgsLoadingStatusSelector } from 'selectors/org_selectors'
import brandHasChannelSelector from './brand_inactive_channel.selectors'
import * as styles from './brand_inactive_channel.css'

// We need to link to the legacy configuration until the settings section is
// implemented. TODO: replace with link to new settings once implemented.
const legacySetupUrl = `${process.env.FE_APP_HOST}/settings/social_profiles`

export const BrandInactiveChannel = ({ channel }) => {
  const chanName = startCase(channel)
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.description}>This brand doesn&apos;t advertise on {chanName}</div>
        <Button size='large' href={legacySetupUrl} className={styles.button}>Add to {chanName}</Button>
      </div>
    </div>
  )
}

BrandInactiveChannel.propTypes = { channel: PropTypes.string }
BrandInactiveChannel.defaultProps = { channel: undefined }

export const CheckBrandChannelActive = ({ orgsLoadingStatus, brandHasChannel, channel, children }) => (
  <span>
    {/* Still loading orgs data */}
    {orgsLoadingStatus &&
      <Modal isOpen closeTimeoutMS={500}>
        <SpinnerModalContent />
      </Modal>
    }
    {/* Done loading orgs and its a valid brand channel */}
    {!orgsLoadingStatus && brandHasChannel &&
      children
    }
    {/* Done loading orgs and its an invalid brand channel */}
    {!orgsLoadingStatus && !brandHasChannel &&
      <BrandInactiveChannel channel={channel} />
    }
  </span>
)

CheckBrandChannelActive.propTypes = {
  orgsLoadingStatus: PropTypes.bool,
  brandHasChannel: PropTypes.bool,
  channel: PropTypes.string,
  children: PropTypes.node
}

CheckBrandChannelActive.defaultProps = {
  orgsLoadingStatus: false,
  brandHasChannel: false,
  channel: undefined,
  children: undefined
}

const mapStateToProps = state => ({
  orgsLoadingStatus: orgsLoadingStatusSelector(state),
  brandHasChannel: brandHasChannelSelector(state),
  channel: curChannelSelector(state)
})

export default connect(mapStateToProps)(CheckBrandChannelActive)

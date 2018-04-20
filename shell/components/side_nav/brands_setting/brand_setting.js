import React from 'react'
// import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {
  AccountInfoIcon,
  AdPixelsIcon,
  ConnectedPropertiesIcon
} from 'playa-styleguide'
import Styles from './brand_setting.css'

export const BRAND_SETTING_NAMES = ['account info', 'ad pixel', 'connected properties']

const renderIcon = (brandName) => {
  switch (brandName) {
    case 'account info':
      return <AccountInfoIcon />
    case 'ad pixel':
      return <AdPixelsIcon />
    case 'connected properties':
      return <ConnectedPropertiesIcon />
    default:
      return null
  }
}

const rowClassNameHelper = (active) => {
  const activeClass = active ? Styles.brandItemActive : Styles.brandItemInactive
  return `${Styles.brandItem} ${activeClass}`
}

export const BrandSettingStatusItem = ({ name, active }) => (
  <div className={rowClassNameHelper(active)} data-active={active}>
    <div className={Styles.brandContent}>
      <div className={Styles.icon}>{renderIcon(name)}</div>
      <div className={Styles.name} data-field='name'>{name}</div>
    </div>
  </div>
)

export const BrandSetting = () => {
  const BrandRows = BRAND_SETTING_NAMES.map(name => (
    <BrandSettingStatusItem
      key={name}
      name={name}
    />
  ))

  return (
    <div>
      <div className={Styles.brandItem}>
        <div className={Styles.brands}>Brand</div>
      </div>
      { BrandRows }
    </div>
  )
}

// We will shape this later. Still debating what this will look like.

// brandStatus.propTypes = {
//   BrandSettingStatuses: PropTypes.shape({
//   })
// }

// brandStatusItem.propTypes = {
// }

// Will update this when i hook up actual values from store.
// TODO: hook this up once i define what data looks like coming back.
const mapStateToProps = () => ({
  // BrandSettingStatuses: state.platforms
})

export default connect(mapStateToProps)(BrandSetting)

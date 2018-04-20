import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'
import { oneLine } from 'common-tags'
import Styles from './brand_menu_item.css'

const classNames = ({ classes, isSelected, isHeading, arrowKeyedTo }) => (
  oneLine`
    ${Styles.item}
    ${classes}
    ${isSelected ? Styles.selected : ''}
    ${isHeading ? Styles.heading : ''}
    ${(arrowKeyedTo && !isHeading) ? Styles.keyedTo : ''}`
)

export const BrandMenuItem = ({
  label,
  hrefPathname,
  classes,
  isSelected,
  isHeading,
  arrowKeyedTo,
  itemRef,
  orgId
}) => (
  <div
    ref={itemRef}
    className={classNames({ classes, isSelected, isHeading, arrowKeyedTo })}
  >
    <Link
      href={{
        pathname: hrefPathname,
        query: { refresh: orgId }
      }}
      className={Styles.link}
    >{label}</Link>
  </div>
)

BrandMenuItem.propTypes = {
  label: PropTypes.string,
  hrefPathname: PropTypes.string,
  classes: PropTypes.string,
  isSelected: PropTypes.bool,
  isHeading: PropTypes.bool
}

BrandMenuItem.defaultProps = {
  label: 'Brand Name Here',
  hrefPathname: '/brands/[someBrandId]/[channel]/manager/',
  classes: '',
  isSelected: false,
  isHeading: false
}

export default BrandMenuItem

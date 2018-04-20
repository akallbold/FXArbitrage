import React from 'react'
import PropTypes from 'prop-types'
import { PersistentQueryLink } from 'redux-little-router'
import { middleEllipsisTagFactory } from 'hyfn8-frontend-cocktail'
import Styles from './bread_crumb.css'

const truncate34 = middleEllipsisTagFactory(34, 14, 17)

const BreadCrumbLink = ({ brandId, channel, name, childrenLevel }) => {
  const href = {
    pathname: `/brands/${brandId}/${channel}/manager/${childrenLevel}`,
    persistQuery: true
  }

  return (
    <PersistentQueryLink href={href} className={Styles.breadcrumb} title={name}>
      {name ? truncate34`${name}` : '--'}
    </PersistentQueryLink>
  )
}

BreadCrumbLink.propTypes = {
  brandId: PropTypes.string,
  channel: PropTypes.string,
  name: PropTypes.string,
  childrenLevel: PropTypes.string
}

BreadCrumbLink.defaultProps = {
  brandId: '',
  channel: '',
  name: '',
  childrenLevel: ''
}

export default BreadCrumbLink

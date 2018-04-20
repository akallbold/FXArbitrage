import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getErrorPageType, getErrorPageData } from 'components/catch_all_page'
import { getPrevPathname } from 'selectors/platform_selectors'
import * as pages from './CatchAll.pages'

export const CatchAllPage = ({ type, data, prevPathname }) => {
  const ErrorPage = pages[type]
  return <ErrorPage {...data} prevPathname={prevPathname} />
}

CatchAllPage.propTypes = {
  type: PropTypes.string,
  data: PropTypes.object,
  prevPathname: PropTypes.string
}

CatchAllPage.defaultProps = {
  type: pages.TYPE_404,
  data: {},
  prevPathname: null
}

const mapStateToProps = state => ({
  type: getErrorPageType(state),
  data: getErrorPageData(state),
  prevPathname: getPrevPathname(state)
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CatchAllPage)

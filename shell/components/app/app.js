import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { includes, some } from 'lodash'
import { fetchRoutine } from 'fetch_routine'
import { ACL_GET_USER, ACL_GET_ORGS } from 'api/configs/acl'
import NavBar from 'components/nav_bar/nav_bar'
import ChannelToolbarContainer from 'components/channel_toolbar_container/channel_toolbar_container'
import ContentContainer from 'components/content_container/content_container'
import { getErrorPageType } from 'components/catch_all_page'
import { currentUserBrandRole } from '../../selectors/org_selectors'
import { GlobalPreLoader } from 'components/global_pre_loader'

class App extends React.Component {
  componentWillMount () {
    this.props.fetchTrigger({ callType: ACL_GET_USER })
    this.props.fetchTrigger({ callType: ACL_GET_ORGS })
  }

  render () {
    const { orgs, errorPageType, curRoles } = this.props
    const unrestrictedRoles = ['administrator', 'advertiser']
    const isUnrestrictedUser = some(unrestrictedRoles, value => includes(curRoles, value))

    return (
      <div className={isUnrestrictedUser ? '' : 'isAnalyst'}>
        <NavBar companies={orgs.companies} />
        <ChannelToolbarContainer />
        <ContentContainer showErrorPage={!!errorPageType} />
        <GlobalPreLoader />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  errorPageType: getErrorPageType(state),
  curRoles: currentUserBrandRole(state)
})

const mapDispatchToProps = {
  fetchTrigger: fetchRoutine.trigger
}

App.propTypes = {
  // state props
  orgs: PropTypes.object,
  errorPageType: PropTypes.string,
  // dispatch props
  fetchTrigger: PropTypes.func.isRequired
}

App.defaultProps = {
  orgs: {},
  errorPageType: null
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

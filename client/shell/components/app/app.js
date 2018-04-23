import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { includes, some } from 'lodash'
import { fetchRoutine } from 'fetch_routine'
import { SHELL_GET_USER } from 'api/configs/shell'
import ContentContainer from 'components/content_container/content_container'
// import { getCurrentUserSelector } from 'FXArbitrage/client/shell/selectors/user_selectors'

class App extends React.Component {
  componentWillMount () {
    this.props.fetchTrigger({ callType: SHELL_GET_USER })
  }

  render () {
    const { errorPageType } = this.props

    return (
      <div>
        <NavBar />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  errorPageType: getErrorPageType(state)
  // user: getCurrentUser(state)
})

const mapDispatchToProps = {
  fetchTrigger: fetchRoutine.trigger
}

App.propTypes = {
  // state props
  errorPageType: PropTypes.string,
  // dispatch props
  fetchTrigger: PropTypes.func.isRequired
}

App.defaultProps = {
  errorPageType: null
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

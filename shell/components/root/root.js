import React from 'react'
import { Provider } from 'react-redux'
import App from 'components/app/app'
import { PusherConnector } from 'pusher_service'

export default class Root extends React.Component {
  constructor (props) {
    super(props)
    this.store = props.store
  }

  render () {
    return (
      <Provider store={this.store}>
        <div>
          <App />
          <PusherConnector />
        </div>
      </Provider>
    )
  }
}

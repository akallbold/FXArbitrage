// Entry point for New Playa FE
import React from 'react'
import { render } from 'react-dom'
import configureStore from 'store/configure_store'
import 'fetchers'
import Root from 'components/root/root'
import 'playa-styleguide/src/fonts/fonts.css'
import 'playa-styleguide/src/stylesheets/global.css'
import rootSagas from './sagas/sagas'
import { initTracker } from 'analytics'

if (process.env.NODE_ENV === 'production' && !process.env.GOOGLE_ANALYTICS_TRACKING) {
  console.error('Check the google analytics env variable! It\'s currently undefined.')
}

try {
  const gaId = process.env.GOOGLE_ANALYTICS_TRACKING || ''
  initTracker({
    target: `gtag_${gaId.replace(/-/g, '_')}`,
    trackerApi: window.ga,
    options: {
      enabled: !!(process.env.NODE_ENV === 'production' && process.env.GOOGLE_ANALYTICS_TRACKING),
      logger: false
    }
  })
} catch (error) {
  console.error('Issue initializing GA tracker: ', error)
}

const store = configureStore()
store.runSaga(rootSagas)
store.initLocation()

render(<Root store={store} />, document.querySelector('#main'))

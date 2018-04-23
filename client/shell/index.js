// Entry point for New Playa FE
import React from 'react'
import { render } from 'react-dom'
import configureStore from 'store/configure_store'
import Root from 'components/root/root'
import rootSagas from './sagas/sagas'

const store = configureStore()
store.runSaga(rootSagas)
store.initLocation()

render(<Root store={store} />, document.querySelector('#main'))

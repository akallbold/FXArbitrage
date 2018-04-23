/* eslint-disable global-require */
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import Raven from 'raven-js'
import createRavenMiddleware from 'raven-for-redux'
import routes, { BASE_NAME } from 'routes'
import { routerForBrowser, initializeCurrentLocation } from 'redux-little-router'
import * as rootReducers from 'reducers/reducers'

const sagaMiddleware = createSagaMiddleware({
  onError: error => Raven.captureException(error)
})
const { reducer, enhancer, middleware } = routerForBrowser({ routes, basename: BASE_NAME })
// Enables redux dev tools chrome extension
// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const composedEnhancers = composeEnhancers(
  enhancer,
  applyMiddleware(
    sagaMiddleware,
    middleware,
    createRavenMiddleware(Raven, {})
  )
)

// Combine the router reducer with the rest
const combinedReducers = combineReducers({
  router: reducer
})

export default function configureStore (initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/reactjs/redux/releases/tag/v3.1.0
  const store = createStore(combinedReducers, initialState, composedEnhancers)

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers/reducers', () =>
      store.replaceReducer(require('../reducers/reducers')/* .default if you use Babel 6+ */)
    )
  }

  // We'll probably need to control when this stuff happens. Making them accessible to the world
  // outside.
  store.initLocation = () => {
    const initialLocation = store.getState().router
    if (initialLocation) store.dispatch(initializeCurrentLocation(initialLocation))
  }
  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)

  return store
}

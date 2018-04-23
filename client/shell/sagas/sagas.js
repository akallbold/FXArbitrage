// Root Saga
import { routinesWatcherSaga } from 'redux-saga-routines'
import { call, all } from 'redux-saga/effects'
import { fetcherSaga } from 'redux-saga-route-fetcher'

const subAppSagasArray = () => (
  Object.keys(subAppSagas).map(key => (call(subAppSagas[key])))
)

export default function * rootSaga () {
  yield all([
    call(fetcherSaga),
    call(routinesWatcherSaga)
  ])
}

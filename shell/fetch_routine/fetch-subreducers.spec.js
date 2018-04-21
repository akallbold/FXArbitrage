import { static as Immutable } from 'seamless-immutable'
import {
  mergeEntity,
  requestState,
  successState,
  failureState,
  fulfillState
} from './fetch-subreducers'

const callType = 'test.thing as thing'
const data = { stuff: 'here' }

const error = { message: 'This is an error' }

describe('Sub-reducer `requestState`', () => {
  it('`requestState` should set `loading` to `true`', () => {
    const curState = {
      thing: {
        loading: false
      }
    }
    const result = requestState(curState, { callType })
    expect(result).toHaveProperty('thing.loading', true)
  })

  it('`requestState` should not change previous `data` state', () => {
    const curState = {
      thing: {
        data
      }
    }
    const result = requestState(curState, { callType })
    expect(result).toHaveProperty('thing.data', data)
  })

  it('`requestState` should not change previous `error` state', () => {
    const curState = {
      thing: {
        error
      }
    }
    const result = requestState(curState, { callType })
    expect(result).toHaveProperty('thing.error', error)
  })
})

describe('Sub-reducer `successState`', () => {
  it('`successState` should set `error` to `null`', () => {
    const curState = {
      thing: {
        error
      }
    }
    const result = successState(curState, { callType })
    expect(result).toHaveProperty('thing.error', null)
  })

  it('`successState` should set `data` from action payload', () => {
    const curState = {
      thing: {
        data: null
      }
    }
    const result = successState(curState, { callType, data })
    expect(result).toHaveProperty('thing.data', data)
  })

  it('`successState` should not change previous `loading` state', () => {
    const curState = {
      thing: {
        loading: true
      }
    }
    const result = successState(curState, { callType })
    expect(result).toHaveProperty('thing.loading', true)
  })
})

describe('Sub-reducer `failureState`', () => {
  it('`failureState` should set `error` from action payload', () => {
    const curState = {
      thing: {
        error: null
      }
    }
    const result = failureState(curState, { callType, error })
    expect(result).toHaveProperty('thing.error', error)
  })

  it('`failureState` should not change previous `loading` state', () => {
    const curState = {
      thing: {
        loading: true
      }
    }
    const result = failureState(curState, { callType })
    expect(result).toHaveProperty('thing.loading', true)
  })

  it('`failureState` should not change previous `data` state', () => {
    const curState = {
      thing: {
        data
      }
    }
    const result = failureState(curState, { callType, data })
    expect(result).toHaveProperty('thing.data', data)
  })
})

describe('Sub-reducer `fulfillState`', () => {
  it('`fulfillState` should set `loading` to `false`', () => {
    const curState = {
      thing: {
        loading: true
      }
    }
    const result = fulfillState(curState, { callType })
    expect(result).toHaveProperty('thing.loading', false)
  })

  it('`fulfillState` should not change previous `data` state', () => {
    const curState = {
      thing: {
        data
      }
    }
    const result = fulfillState(curState, { callType })
    expect(result).toHaveProperty('thing.data', data)
  })

  it('`fulfillState` should not change previous `error` state', () => {
    const curState = {
      thing: {
        error
      }
    }
    const result = fulfillState(curState, { callType })
    expect(result).toHaveProperty('thing.error', error)
  })
})

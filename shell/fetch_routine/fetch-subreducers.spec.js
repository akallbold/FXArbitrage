import { static as Immutable } from 'seamless-immutable'
import {
  mergeEntity,
  applyCustomMerge,
  requestState,
  successState,
  failureState,
  fulfillState,
  clearErrorState,
  clearDataState
} from './fetch-subreducers'

const callType = 'test.thing as thing'
const data = { stuff: 'here' }

const error = { message: 'This is an error' }

describe('Reducer Helper Functions', () => {
  it('`mergeEntity` should merge correct entity based on `callType` in payload', () => {
    const curState = { thing: {}, otherThing: {} }
    const newEntityState = {
      loading: false,
      data: { stuff: 'here' },
      error: null
    }
    const _mergedEntity = mergeEntity(curState, 'thing', newEntityState, false)
    expect(_mergedEntity).toHaveProperty('otherThing', curState.otherThing)
    expect(_mergedEntity).toHaveProperty('thing', newEntityState)
  })

  it('`mergeEntity` should properly merge entity contents', () => {
    const thing = {
      loading: true,
      data: { prevProp: 'still here?' },
      error: null
    }
    const newThing = {
      loading: false,
      data: { stuff: 'here' },
      error: null
    }
    const expectedMergedThing = {
      loading: false,
      data: { stuff: 'here', prevProp: 'still here?' },
      error: null
    }
    const curState = { thing }
    // const mergedEntity = mergeEntity(curState, { callType }, newThing)
    const mergedEntity = mergeEntity(curState, 'thing', newThing, false)
    expect(mergedEntity).toHaveProperty('thing', expectedMergedThing)
    expect(mergedEntity.thing).not.toEqual(thing)
    expect(mergedEntity.thing).not.toEqual(newThing)
  })

  it('`applyCustomMerge` should properly call and merge `entities[entity].data', () => {
    const merge = (data, newData) => Immutable([]).concat(data, newData)
    const configs = {
      test: {
        getThingHasCustomMerge: () => ({ merge })
      }
    }

    const entities = Immutable({
      things: {
        loading: true,
        data: [{ id: 420 }],
        error: null
      }
    })

    const payload = {
      callType: 'test.getThingHasCustomMerge merge things',
      data: [{ id: 421 }]
    }

    const expectedMergedData = [{ id: 420 }, { id: 421 }]
    const mergedData = applyCustomMerge(entities, payload, configs)
    // Assert the merge function was called by checking against expected result.
    expect(mergedData).toEqual(expectedMergedData)
    // Check that the result is immutable, even though the responsibility is on the merge function.
    expect(Immutable.isImmutable(mergedData)).toBe(true)
  })

  it('`applyCustomMerge` should throw if merge function returns mutable data',
    () => {
      const merge = (data, newData) => []
      const configs = {
        test: {
          getThingHasCustomMerge: () => ({ merge })
        }
      }

      const entities = Immutable({
        things: {
          loading: true,
          data: [],
          error: null
        }
      })

      const payload = {
        callType: 'test.getThingHasCustomMerge merge things',
        data: []
      }
      expect(() => applyCustomMerge(entities, payload, configs))
        .toThrowError(/The data returned from your custom merge/)
    })

  it('`applyCustomMerge` handles empty initial state',
    () => {
      const merge = (data, newData) => {
        // NOTE: We must handle cases when data is `undefined`.
        const currentData = data || Immutable([])

        return Immutable([]).concat(currentData, newData)
      }
      const configs = {
        test: {
          getThingHasCustomMerge: () => ({ merge })
        }
      }

      const entities = Immutable({})

      const payload = {
        callType: 'test.getThingHasCustomMerge merge things',
        data: [{ id: 421 }]
      }

      const expectedMergedData = [{ id: 421 }]
      const mergedData = applyCustomMerge(entities, payload, configs)
      // Assert the merge function was called by checking against expected result.
      expect(mergedData).toEqual(expectedMergedData)
      // Check that the result is immutable, even though the responsibility is on the merge function.
      expect(Immutable.isImmutable(mergedData)).toBe(true)
    })
})

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

describe('Sub-reducer `successState` with `merge`', () => {
  const merge = (data, newData) => Immutable([]).concat(data, newData)
  const configs = {
    test: {
      getThingHasCustomMerge: () => ({ merge })
    }
  }

  const entities = Immutable({
    things: {
      loading: true,
      data: [{ id: 420 }],
      error: null
    }
  })

  const payload = {
    callType: 'test.getThingHasCustomMerge merge things',
    data: [{ id: 421 }]
  }

  const expectedMergedState = Immutable({
    things: {
      loading: true,
      data: [{ id: 420 }, { id: 421 }],
      error: null
    }
  })

  it('`successState` should use merge function to merge the `data` key of entity state', () => {
    const mergedState = successState(entities, payload, configs)
    // Assert the successState used the merge function to merge the `data` key in the state.
    expect(mergedState).toEqual(expectedMergedState)
    // Check that the new merged state is immutable.
    expect(Immutable.isImmutable(mergedState)).toBe(true)
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

describe('Sub-reducer `clearErrorState`', () => {
  it('`clearErrorState` should set `error` to `null`', () => {
    const curState = {
      thing: {
        error
      }
    }
    const result = clearErrorState(curState, { entity: 'thing' })
    expect(result).toHaveProperty('thing.error', null)
  })

  it('`clearErrorState` should not change previous `data` state', () => {
    const curState = {
      thing: {
        data
      }
    }
    const result = clearErrorState(curState, { entity: 'thing' })
    expect(result).toHaveProperty('thing.data', data)
  })

  it('`clearErrorState` should not change previous `loading` state', () => {
    const curState = {
      thing: {
        loading: false
      }
    }
    const result = clearErrorState(curState, { entity: 'thing' })
    expect(result).toHaveProperty('thing.loading', false)
  })
})

describe('Sub-reducer `clearDataState`', () => {
  it('sets `data` to `null`', () => {
    const curState = {
      thing: { data }
    }
    const result = clearDataState(curState, { entity: 'thing' })
    expect(result).toHaveProperty('thing.data', null)
  })

  it('does not change previous `error` state', () => {
    const curState = {
      thing: { error }
    }
    const result = clearDataState(curState, { entity: 'thing' })
    expect(result).toHaveProperty('thing.error', error)
  })

  it('does not change previous `loading` state', () => {
    const curState = {
      thing: { loading: false }
    }
    const result = clearDataState(curState, { entity: 'thing' })
    expect(result).toHaveProperty('thing.loading', false)
  })
})

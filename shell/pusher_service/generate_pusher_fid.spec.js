import { set, merge } from 'lodash'
import generatePusherFid from './generate_pusher_fid'
import { registerPusherAction } from './pusher_fids_cache'

const store = {}

const invalidMetricsTriggerAction = {
  type: 'FETCH_TRIGGER',
  payload: {
    notifiableParams: {
      fid: 'foobar',
      action: 'invalidPusherAction'
    },
    someprop: 'other things that this middleware doesnt care about here'
  }
}

const validMetricsTriggerAction = {
  type: 'FETCH_TRIGGER',
  payload: {
    notifiableParams: {
      fid: 'foobar',
      action: 'validPusherAction'
    },
    someprop: 'other things that this middleware doesnt care about here'
  }
}

registerPusherAction('validPusherAction')

describe('generatePusherFid (middleware)', () => {
  it('noop if not FETCH_TRIGGER', () => {
    const next = jest.fn()
    generatePusherFid(store)(next)({ type: 'NOT_FETCH_TRIGGER', payload: { hello: 'world' } })
    expect(next).toHaveBeenCalledWith({ type: 'NOT_FETCH_TRIGGER', payload: { hello: 'world' } })
  })

  it('does NOT add dynamic fid if pusher action is not registered', () => {
    const next = jest.fn()
    generatePusherFid(store)(next)(invalidMetricsTriggerAction)
    expect(next).toHaveBeenCalledWith(invalidMetricsTriggerAction)
  })

  it('adds dynamic fid if pusher action is registered', () => {
    const next = jest.fn()
    generatePusherFid(store)(next)(validMetricsTriggerAction)
    const expectedModifiedAction = merge({}, validMetricsTriggerAction, set({}, 'payload.notifiableParams.fid', 'uid-here.420'))
    expect(next).toHaveBeenCalledWith(expectedModifiedAction)
  })
})

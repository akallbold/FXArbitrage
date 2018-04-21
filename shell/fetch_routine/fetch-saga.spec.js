import { call, put, all, select } from 'redux-saga/effects'
import { get } from 'lodash'
import { camelizeKeys } from 'humps'
import api from 'api'
import { fetchSubroutine, batchFetchSubroutine, batchCompleteFetchSubroutine } from './fetch-sagas'
import fetchRoutine from './fetch-routine'

const {
  triggerBatch,
  triggerBatchComplete,
  trigger,
  request,
  success,
  failure,
  fulfill
} = fetchRoutine

const callType = 'test.thing as thing'
const payload = { callType }
const mockRes = { data: { response: { i_should_be_camelized: 'Yes, you should.' } } }

const callTypeRespKey = 'test.getCampaigns from campaigns as testCampaigns'
const payloadRespKey = { callType: callTypeRespKey }
const mockResUniqueKey = {
  data: {
    campaigns: [
      { id: 143, name: 'Campaign A', account_id: 420 },
      { id: 142, name: 'Campaign B', account_id: 420 }
    ]
  }
}

const batchCallType = 'test.updateThing merge things batch'
const batchAutoCallType = 'test.updateThing merge things batchauto'
const batchPayload = {
  callType: batchCallType,
  options: {
    thing1: { thingId: 't1' },
    thing2: { thingId: 't2' },
    thing3: { thingId: 't3' }
  }
}

const error = { message: 'This is an error.' }

describe('Fetch Sagas fetchSubroutine', () => {
  it('should throw if no `callType` on payload', () => {
    expect(() => fetchSubroutine({}).next()).toThrow()
  })

  it('should yield the put for `FETCH_REQUEST`', () => {
    const fetchRoutineGen = fetchSubroutine(trigger(payload))
    // advance generator past preFetchers
    fetchRoutineGen.next()
    const requestPut = fetchRoutineGen.next()
    const expectedRequestPut = put(request(payload))
    expect(requestPut.value).toEqual(expectedRequestPut)
  })

  it('should yield the call for `api`', () => {
    const fetchRoutineGen = fetchSubroutine(trigger(payload))
    // advance generator past preFetchers
    fetchRoutineGen.next()
    // advance generator past the first put
    fetchRoutineGen.next()
    const fetchCall = fetchRoutineGen.next()
    const expectedFetchCall = call(api, payload)
    expect(fetchCall.value).toEqual(expectedFetchCall)
  })

  it('should yield the put for `FETCH_SUCCESS` and response data should be camelized', () => {
    const fetchRoutineGen = fetchSubroutine(trigger(payload))
    // advance generator past preFetchers
    fetchRoutineGen.next()
    // advance generator past the first put
    fetchRoutineGen.next()
    // advance generator past the call
    fetchRoutineGen.next()
    // get yielded success put. NOTE: Using response with snake case keys.
    const successPut = fetchRoutineGen.next(mockRes)
    // set up expected put side effect. NOTE: Camelize keys first as a bonus test case.
    const data = camelizeKeys(mockRes.data.response)
    const expectedSuccessPut = put(success({ data, callType }))
    expect(successPut.value).toEqual(expectedSuccessPut)
  })

  it('should yield the put for `FETCH_SUCCESS` with response data from custom response key', () => {
    const fetchRoutineGen = fetchSubroutine(trigger(payloadRespKey))
    // advance generator past preFetchers
    fetchRoutineGen.next()
    // advance generator past the first put
    fetchRoutineGen.next()
    // advance generator past the call
    fetchRoutineGen.next()
    // get yielded success put. NOTE: Using response with snake case keys.
    const successPut = fetchRoutineGen.next(mockResUniqueKey)
    // set up expected put side effect. NOTE: Camelize keys first as a bonus test case.
    const data = camelizeKeys(mockResUniqueKey.data.campaigns)
    const expectedSuccessPut = put(success({ data, callType: callTypeRespKey }))
    expect(successPut.value).toEqual(expectedSuccessPut)
  })

  it('should yield the put for `FETCH_FAILURE`', () => {
    const fetchRoutineGen = fetchSubroutine(trigger(payload))
    // advance generator past the first put
    fetchRoutineGen.next()
    // advance generator past the call
    fetchRoutineGen.next()
    const serverError = { ...error, name: 'ServerError' }
    // get yielded failure put.
    const fetchFailurePut = fetchRoutineGen.throw(serverError)
    // set up expected put side effect
    const expectedFailurePut = put(failure({ error: serverError, callType }))
    expect(fetchFailurePut.value).toEqual(expectedFailurePut)
  })

  it('should yield the put for `FETCH_FULFILL` after success', () => {
    const fetchRoutineGen = fetchSubroutine(trigger(payload))
    // advance generator past preFetchers
    fetchRoutineGen.next()
    // advance generator past the first put
    fetchRoutineGen.next()
    // advance generator past the call
    fetchRoutineGen.next()
    // advance generator past the success put
    fetchRoutineGen.next()
    // get yielded fulfill put
    const fulfillPut = fetchRoutineGen.next()
    // set up expected put side effect
    const expectedFulfillPut = put(fulfill({ callType }))
    expect(fulfillPut.value).toEqual(expectedFulfillPut)
  })

  it('should yield the put for `FETCH_FULFILL` after failure', () => {
    const fetchRoutineGen = fetchSubroutine(trigger(payload))
    // advance generator past the first put
    fetchRoutineGen.next()
    // advance generator past the call
    fetchRoutineGen.next()
    // advance generator past the failure put
    fetchRoutineGen.throw({ ...error, name: 'ServerError' })
    // get yielded fulfill put
    const fulfillPut = fetchRoutineGen.next()
    // set up expected put side effect
    const expectedFulfillPut = put(fulfill({ callType }))
    expect(fulfillPut.value).toEqual(expectedFulfillPut)
  })

  it('should yield the put for `FETCH_SUCCESS` after batch complete for `batchauto`', () => {
    const fetchRoutineGen = fetchSubroutine(trigger({ callType: batchAutoCallType }))
    // advance generator past preFetchers
    fetchRoutineGen.next()
    // advance generator past the first put
    fetchRoutineGen.next()
    // advance generator past the call
    fetchRoutineGen.next()
    // advance generator past the success put
    fetchRoutineGen.next()
    // advance generator past the fulfill put
    fetchRoutineGen.next()

    // make sure the select is correct
    const selectForBatch = fetchRoutineGen.next().value
    const expectedSelectForBatch = select(state => get(state, 'entities.thingsBatch'))
    expect(JSON.stringify(selectForBatch)).toEqual(JSON.stringify(expectedSelectForBatch))

    const batchEntityData = {
      thing1: { data: {}, error: null, loading: false },
      thing2: { data: {}, error: null, loading: false }
    }
    const putBatchCompleteSuccess = fetchRoutineGen.next(batchEntityData)
    const expectedPut = put(fetchRoutine.success({
      data: batchEntityData,
      callType: batchAutoCallType
    }))
    expect(JSON.stringify(putBatchCompleteSuccess.value)).toEqual(JSON.stringify(expectedPut))
  })
})

describe('Fetch Sagas batchFetchSubroutine', () => {
  const expectedBatchFetchAll = all([
    call(fetchSubroutine, { payload: {
      callType: batchCallType, fetchRoutinePayload: { batchItemKey: 'thing1' }, thingId: 't1' }}),
    call(fetchSubroutine, { payload: {
      callType: batchCallType, fetchRoutinePayload: { batchItemKey: 'thing2' }, thingId: 't2' }}),
    call(fetchSubroutine, { payload: {
      callType: batchCallType, fetchRoutinePayload: { batchItemKey: 'thing3' }, thingId: 't3' }})
  ])

  it('should yield `all` side effect of `call` side effects for fetchSubroutine', () => {
    const batchFetchRoutineGen = batchFetchSubroutine(triggerBatch(batchPayload))
    // get the `all` effect with the `call` effects to fetchSubroutine
    const batchFetchAll = batchFetchRoutineGen.next()
    expect(batchFetchAll.value).toEqual(expectedBatchFetchAll)
  })

  it('should throw error when batch keyword is missing from callType', () => {
    const payloadNoBatch = {
      ...batchPayload,
      callType
    }
    const batchFetchRoutineGen = batchFetchSubroutine(triggerBatch(payloadNoBatch))
    expect(() => batchFetchRoutineGen.next()).toThrow()
  })
})

describe('Fetch Sagas batchCompleteFetchSubroutine', () => {
  it('should first yield a select effect with selector for batch', () => {
    const batchFetchRoutineGen = batchCompleteFetchSubroutine(triggerBatchComplete(batchPayload))
    expect(
      JSON.stringify(batchFetchRoutineGen.next().value)
    ).toEqual(
      JSON.stringify(select(state => get(state, `entities.thingsBatch`)))
    )
  })

  it('should next yield a put effect with selector for fetch success', () => {
    const mockBatchEntity = {
      thing1: { data: {}, error: null, loading: false },
      thing2: { data: {}, error: null, loading: false }
    }
    const batchFetchRoutineGen = batchCompleteFetchSubroutine(triggerBatchComplete(batchPayload))
    // advance generator to the select
    batchFetchRoutineGen.next()
    // get the put effect
    const putEffect = batchFetchRoutineGen.next(mockBatchEntity).value
    const expectedPutEffect = put(success({ data: mockBatchEntity, callType: batchCallType }))
    expect(putEffect).toEqual(expectedPutEffect)
  })

  it('should throw error when batch keyword is missing from callType', () => {
    const payloadNoBatch = {
      ...batchPayload,
      callType
    }
    const batchFetchRoutineGen = batchFetchSubroutine(triggerBatchComplete(payloadNoBatch))
    expect(() => batchFetchRoutineGen.next()).toThrow()
  })
})

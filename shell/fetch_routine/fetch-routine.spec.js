import fetchRoutine from './fetch-routine'

const {
  TRIGGER,
  REQUEST,
  SUCCESS,
  FAILURE,
  FULFILL,
  trigger,
  request,
  success,
  failure,
  fulfill
} = fetchRoutine

describe('fetchRoutine', () => {
  it('should have default import be a function that returns a promise', () => {
    const routineThunk = fetchRoutine({ }, () => {})
    expect(routineThunk.then).toBeTruthy()
  })
})

describe('Fetch Routine Actions', () => {
  const payload = {}

  it('should have a `trigger` action creator that return `type` matching `TRIGGER`', () => {
    const action = trigger(payload)
    expect(action).toEqual({ type: TRIGGER, payload })
  })

  it('should have a `request` action creator that return `type` matching `REQUEST`', () => {
    const action = request(payload)
    expect(action).toEqual({ type: REQUEST, payload })
  })

  it('should have a `success` action creator that return `type` matching `SUCCESS`', () => {
    const action = success(payload)
    expect(action).toEqual({ type: SUCCESS, payload })
  })

  it('should have a `failure` action creator that return `type` matching `FAILURE`', () => {
    const action = failure(payload)
    expect(action).toEqual({ type: FAILURE, payload })
  })

  it('should have a `fulfill` action creator that return `type` matching `FULFILL`', () => {
    const action = fulfill(payload)
    expect(action).toEqual({ type: FULFILL, payload })
  })
})

import getPrefetchers, { waitForPusher, waitForUser } from './pre-fetch'
import { get } from 'lodash'
import { call, select, all } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { currentUserSelector } from 'selectors/user_selectors'

describe('waits for pusher', () => {
  const generator = waitForPusher('fb.')
  it('selects the pusher loading property from state.', () => {
    const selector = select(state => get(state, 'pusherData.connected'))
    const pusherConnectedSelect = JSON.stringify(generator.next().value)
    expect(
      pusherConnectedSelect
    ).toEqual(JSON.stringify(selector))
  })

  it('it delays.', () => {
    expect(
      JSON.stringify(generator.next().value)
    ).toEqual(JSON.stringify(delay(200, true)))
  })

  it('calls itself', () => {
    expect(
      JSON.stringify(generator.next().value)
    ).toEqual(JSON.stringify(call(waitForPusher, 'fb.')))
  })
})

describe('does not waitForPusher', () => {
  const generator = waitForPusher('call type not matching pattern')
  it('selects the pusher loading property from state.', () => {
    generator.next()
    expect(
      generator.next().done
    ).toBe(true)
  })
})

describe('waits for pusher', () => {
  const generator = waitForUser('fb.')

  it('selects the pusher loading property from state.', () => {
    const selector = select(currentUserSelector)
    const pusherConnectedSelect = JSON.stringify(generator.next().value)
    expect(
      pusherConnectedSelect
    ).toEqual(JSON.stringify(selector))
  })

  it('it delays.', () => {
    expect(
      JSON.stringify(generator.next().value)
    ).toEqual(JSON.stringify(delay(200, true)))
  })

  it('calls itself', () => {
    expect(
      JSON.stringify(generator.next().value)
    ).toEqual(JSON.stringify(call(waitForPusher, 'fb.')))
  })
})

describe('does not waitForPusher', () => {
  const generator = waitForUser('call type not matching pattern')
  it('selects the pusher loading property from state.', () => {
    generator.next()
    expect(
      generator.next().done
    ).toBe(true)
  })
})

describe('default export is a function', () => {
  it('returns a yield all', () => {
    const generator = getPrefetchers('fb.')()
    expect(generator.next().value).toEqual(all([
      call(waitForPusher, 'fb.'),
      call(waitForUser, 'fb.')
    ]))
  })
})

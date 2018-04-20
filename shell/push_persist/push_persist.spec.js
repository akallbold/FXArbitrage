import { put, select } from 'redux-saga/effects'
import { push } from 'redux-little-router'
import { pushPersist as pushPersistAction, PUSH_PERSIST } from './push_persist_actions'
import { mergeForPush, pushPersist as pushPersistSubroutine } from './push_persist_sagas'

const curRouterState = {
  pathname: '/some/previous/url',
  query: { page: '1', sort: 'asc', filter: 'campaigns' }
}
const payload = { pathname: '/some/url', query: { page: '2', sort: null } }
const mergedRouterState = { pathname: '/some/url', query: { page: '2', filter: 'campaigns' } }

describe('Push Persist Actions', () => {
  describe('pushPersist action creator', () => {
    it('should return action with `type` matching `PUSH_PERSIST` constant and expected `payload`',
      () => {
        const action = pushPersistAction(payload)
        expect(action).toEqual({ type: PUSH_PERSIST, payload })
      }
    )
  })
})

describe('Push Persist Sagas', () => {
  describe('mergeForPush', () => {
    it('should merge as expected', () => {
      const nextRouterState = mergeForPush(payload, curRouterState)
      expect(nextRouterState).toEqual(mergedRouterState)
    })
  })

  describe('pushPersist subroutine', () => {
    /**
     * The stringify here allows us to check equality without the anonymous functions forcing it to
     * fail. The stringified objects however do not have the `selector` key so a false positive is
     * possible with this test.
     */
    it('should first yield a `select` effect', () => {
      const action = pushPersistAction(payload)
      const pushPersistGen = pushPersistSubroutine(action)
      expect(
        JSON.stringify(pushPersistGen.next().value)
      ).toEqual(
        JSON.stringify(select(state => {}))
      )
    })

    /**
     * This test makes up for the shortcomings of the test above and ensures the yielded `select`
     * side effect has a selector key in the args.
     */
    it('should first yield a `select` effect with a selector key in args', () => {
      const action = pushPersistAction(payload)
      const pushPersistGen = pushPersistSubroutine(action)
      expect(pushPersistGen.next().value).toHaveProperty('SELECT.selector')
    })

    it('should next yield a `put` effect for little router\'s push action with merged payload',
      () => {
        const action = pushPersistAction(payload)
        const pushPersistGen = pushPersistSubroutine(action)
        // advance generator to the select
        pushPersistGen.next()
        // get the yielded put effect given the current router state mock. The results here include the
        // merged `payload` and current router state mock using the `mergeForPush` function.
        const putEffect = pushPersistGen.next(curRouterState).value
        const putEffectExpected = put(push(mergedRouterState))
        expect(putEffect).toEqual(putEffectExpected)
      }
    )
  })
})

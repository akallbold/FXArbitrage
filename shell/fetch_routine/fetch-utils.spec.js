import {
  parseCallType,
  createCallType,
  getConfig,
  prepPayloadForApi,
  prepConfigForApi,
  ent,
  isBatchComplete
} from './fetch-utils'

describe('parseCallType', () => {
  it('should throw with invalid callType', () => {
    expect(() => parseCallType('acl.getUser az userData')).toThrow()
  })

  it('should work with ONLY `as` putType', () => {
    const parsedCallType = parseCallType('acl.getUser as aclUser')
    expect(parsedCallType).toEqual({
      func: 'acl.getUser',
      responseKey: undefined,
      putType: 'as',
      entity: 'aclUser',
      batch: undefined
    })
  })

  it('should work with `as` putType AND `from` responseKey', () => {
    const parsedCallType = parseCallType('acl.getUser from userData as aclUser')
    expect(parsedCallType).toEqual({
      func: 'acl.getUser',
      responseKey: 'userData',
      putType: 'as',
      entity: 'aclUser',
      batch: undefined
    })
  })

  it('should work with `batch` keyword', () => {
    const parsedCallType = parseCallType('acl.getUser as aclUser batch')
    expect(parsedCallType).toEqual({
      func: 'acl.getUser',
      responseKey: undefined,
      putType: 'as',
      entity: 'aclUser',
      batch: 'batch'
    })
  })

  it('should work with `batchauto` keyword', () => {
    const parsedCallType = parseCallType('acl.getUser as aclUser batchauto')
    expect(parsedCallType).toEqual({
      func: 'acl.getUser',
      responseKey: undefined,
      putType: 'as',
      entity: 'aclUser',
      batch: 'batchauto'
    })
  })
})

describe('createCallType', () => {
  it('should throw with invalid callType props', () => {
    expect(() => createCallType({})).toThrow(/Cannot create callType/)
  })

  it('should work with ONLY required props', () => {
    const callType = createCallType({
      func: 'acl.getUser',
      responseKey: undefined,
      putType: undefined,
      entity: 'aclUser',
      batch: undefined
    })
    expect(callType).toEqual('acl.getUser as aclUser')
  })

  it('should work with `responseKey`', () => {
    const callType = createCallType({
      func: 'acl.getUser',
      responseKey: 'user',
      putType: undefined,
      entity: 'aclUser',
      batch: undefined
    })
    expect(callType).toEqual('acl.getUser from user as aclUser')
  })

  it('should work with `batch` as boolean', () => {
    const callType = createCallType({
      func: 'acl.getUser',
      responseKey: 'user',
      putType: 'merge',
      entity: 'aclUser',
      batch: true
    })
    expect(callType).toEqual('acl.getUser from user merge aclUser batch')
  })
})

describe('getConfig', () => {
  const userConfig = {
    method: 'GET',
    url: 'api/user',
    headers: {},
    transformResponse: () => {}
  }

  const campaignsConfig = {
    method: 'GET',
    url: 'api/campaigns',
    headers: {},
    transformResponse: () => {}
  }

  const configs = {
    shell: { getUser: () => userConfig },
    test: { getWithParams: ({ id }) => ({ shouldHaveId: `right here ---> ${id}` }) }
  }

  it('should return correct config given callType', () => {
    const config = getConfig(configs, 'shell.getUser as shellUser')
    expect(config).toEqual(userConfig)
  })

  it('should return correct config with options integrated', () => {
    const config = getConfig(configs, 'test.getWithParams as testThings', { id: 420 })
    expect(config).toEqual({ shouldHaveId: 'right here ---> 420' })
  })

  it('should throw if config factory function is not found', () => {
    expect(() => getConfig(configs, 'foo.bar as bar', { id: 420 })).toThrow()
  })
})

describe('prepPayloadForApi', () => {
  it('should strip the `fetchRoutinePayload` object from the payload', () => {
    const payload = {
      callType: 'acl.getUser as aclUser',
      id: '420',
      fetchRoutinePayload: {
        key: '420'
      }
    }

    const expectedPayload = {
      callType: 'shell.getUser as shellUser',
      id: '420'
    }
    expect(prepPayloadForApi(payload)).toEqual(expectedPayload)
  })

  it('should not throw if `fetchRoutinePayload` is not present', () => {
    const payload = {
      callType: 'shell.getUser as shellUser',
      id: '420'
    }
    expect(prepPayloadForApi(payload)).toEqual(payload)
    expect(prepPayloadForApi({})).toEqual({})
  })

  it('should return null when passed falsey', () => {
    expect(prepPayloadForApi(null)).toEqual(null)
  })
})

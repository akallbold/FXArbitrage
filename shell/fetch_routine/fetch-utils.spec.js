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

  it('should work with ONLY `merge` putType', () => {
    const parsedCallType = parseCallType('acl.getUser merge aclUser')
    expect(parsedCallType).toEqual({
      func: 'acl.getUser',
      responseKey: undefined,
      putType: 'merge',
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

  it('should work with `merge` putType AND `from` responseKey', () => {
    const parsedCallType = parseCallType('acl.getUser from userData merge aclUser')
    expect(parsedCallType).toEqual({
      func: 'acl.getUser',
      responseKey: 'userData',
      putType: 'merge',
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

  it('should work with `putType`', () => {
    const callType = createCallType({
      func: 'acl.getUser',
      responseKey: 'user',
      putType: 'merge',
      entity: 'aclUser',
      batch: undefined
    })
    expect(callType).toEqual('acl.getUser from user merge aclUser')
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

  it('should work with `batch` as string', () => {
    const callType = createCallType({
      func: 'acl.getUser',
      responseKey: 'user',
      putType: 'merge',
      entity: 'aclUser',
      batch: 'batch'
    })
    expect(callType).toEqual('acl.getUser from user merge aclUser batch')
  })

  it('should work with `batch` as `batchauto` string', () => {
    const callType = createCallType({
      func: 'acl.getUser',
      responseKey: 'user',
      putType: 'merge',
      entity: 'aclUser',
      batch: 'batchauto'
    })
    expect(callType).toEqual('acl.getUser from user merge aclUser batchauto')
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
    transformResponse: () => {},
    merge: () => console.log('Ima merging function')
  }

  const configs = {
    acl: { getUser: () => userConfig },
    sc: { getCampaigns: () => campaignsConfig },
    test: { getWithParams: ({ id }) => ({ shouldHaveId: `right here ---> ${id}` }) }
  }

  it('should return correct config given callType', () => {
    const config = getConfig(configs, 'acl.getUser as aclUser')
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
        batchItemKey: '420'
      }
    }

    const expectedPayload = {
      callType: 'acl.getUser as aclUser',
      id: '420'
    }
    expect(prepPayloadForApi(payload)).toEqual(expectedPayload)
  })

  it('should not throw if `fetchRoutinePayload` is not present', () => {
    const payload = {
      callType: 'acl.getUser as aclUser',
      id: '420'
    }
    expect(prepPayloadForApi(payload)).toEqual(payload)
    expect(prepPayloadForApi({})).toEqual({})
  })

  it('should return null when passed falsey', () => {
    expect(prepPayloadForApi(null)).toEqual(null)
  })
})

describe('prepConfigForApi', () => {
  it('should strip the `merge` function from the axios config', () => {
    const config = {
      method: 'PUT',
      url: '/some/endpoint',
      headers: {},
      merge: () => console.log('Ima merge function.')
    }

    const expectedConfig = {
      method: 'PUT',
      url: '/some/endpoint',
      headers: {}
    }
    expect(prepConfigForApi(config)).toEqual(expectedConfig)
  })

  it('should not throw if `merge` function is not present', () => {
    const config = {
      method: 'PUT',
      url: '/some/endpoint',
      headers: {}
    }
    expect(prepConfigForApi(config)).toEqual(config)
    expect(prepConfigForApi({})).toEqual({})
  })

  it('should return null when passed falsey', () => {
    expect(prepConfigForApi(null)).toEqual(null)
  })
})

describe('ent template tag', () => {
  it('should conditionally add append `Batch` to string', () => {
    const entity = 'scStuff'
    expect(ent`${entity}${true}`).toEqual('scStuffBatch')
  })
})

describe('isBatchComplete', () => {
  it('should return true when all batch items have data && loading is false', () => {
    const batchEntityData = {
      thing1: { data: {}, error: null, loading: false },
      thing2: { data: {}, error: null, loading: false }
    }
    expect(isBatchComplete(batchEntityData)).toEqual(true)
  })

  it('should return true when all batch items have error && loading is false', () => {
    const batchEntityData = {
      thing1: { data: null, error: {}, loading: false },
      thing2: { data: null, error: {}, loading: false }
    }
    expect(isBatchComplete(batchEntityData)).toEqual(true)
  })

  it('should return true when all batch items have data or error && loading is false', () => {
    const batchEntityData = {
      thing1: { data: null, error: {}, loading: false },
      thing2: { data: {}, error: null, loading: false }
    }
    expect(isBatchComplete(batchEntityData)).toEqual(true)
  })

  it('should return false when first in batch is not complete', () => {
    const batchEntityData = {
      thing1: { data: null, error: null, loading: true },
      thing2: { data: {}, error: null, loading: false }
    }
    expect(isBatchComplete(batchEntityData)).toEqual(false)
  })

  it('should return false when last in batch is not complete', () => {
    const batchEntityData = {
      thing1: { data: {}, error: null, loading: false },
      thing2: { data: null, error: null, loading: true }
    }
    expect(isBatchComplete(batchEntityData)).toEqual(false)
  })

  it('should return false when shit is all over the place', () => {
    const batchEntityData = {
      thing1: { data: null, error: null, loading: false },
      thing2: { data: {}, error: null, loading: false },
      thing3: { data: null, error: {}, loading: false },
      thing4: { data: null, error: null, loading: true },
      thing5: { data: {}, error: null, loading: true },
      thing6: { data: null, error: {}, loading: true },
      thing7: { data: {}, error: {}, loading: false },
      thing8: { data: {}, error: {}, loading: true }
    }
    expect(isBatchComplete(batchEntityData)).toEqual(false)
  })
})

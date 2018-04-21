import {
  registerPusherAction,
  isRegisteredPusherAction,
  createFid,
  getFid,
  removeFid,
  isLatestFid,
  clearFids
} from './pusher_fids_cache'

describe('Pusher FID cache', () => {
  it('can register and validate valid pusher action key', () => {
    registerPusherAction('validPusherActionKey')
    expect(isRegisteredPusherAction('validPusherActionKey')).toEqual(true)
  })

  it('can create an fid', () => {
    const fid = createFid({ pusherAction: 'validPusherActionKey' })
    expect(fid).toEqual('uid-here.420')
  })

  it('can create an fid with custom prefix', () => {
    const fid = createFid({ pusherAction: 'validPusherActionKey', prefix: 'imaprefix' })
    expect(fid).toEqual('imaprefix.uid-here.420')
  })

  it('can get an fid', () => {
    createFid({ pusherAction: 'validPusherActionKey' })
    expect(getFid('validPusherActionKey')).toEqual('uid-here.420')
  })

  it('can cache only 1 fid', () => {
    const firstFid = createFid({ pusherAction: 'validPusherActionKey', prefix: 'one' })
    const secondFid = createFid({ pusherAction: 'validPusherActionKey', prefix: 'two' })
    expect(isLatestFid({ pusherAction: 'validPusherActionKey', fid: firstFid })).toEqual(false)
    expect(isLatestFid({ pusherAction: 'validPusherActionKey', fid: secondFid })).toEqual(true)
  })

  it('can cache only 1 fid for more than one pusherAction', () => {
    const fid1A = createFid({ pusherAction: 'validPusherActionKeyOne', prefix: 'oneA' })
    const fid1B = createFid({ pusherAction: 'validPusherActionKeyOne', prefix: 'oneB' })
    const fid2A = createFid({ pusherAction: 'validPusherActionKeyTwo', prefix: 'twoA' })
    const fid2B = createFid({ pusherAction: 'validPusherActionKeyTwo', prefix: 'twoB' })

    expect(isLatestFid({ pusherAction: 'validPusherActionKeyOne', fid: fid1A })).toEqual(false)
    expect(isLatestFid({ pusherAction: 'validPusherActionKeyOne', fid: fid1B })).toEqual(true)

    expect(isLatestFid({ pusherAction: 'validPusherActionKeyTwo', fid: fid2A })).toEqual(false)
    expect(isLatestFid({ pusherAction: 'validPusherActionKeyTwo', fid: fid2B })).toEqual(true)
  })

  it('can remove a cached fid', () => {
    const fooFid = createFid({ pusherAction: 'foo', prefix: 'foo' })
    const barFid = createFid({ pusherAction: 'bar', prefix: 'bar' })
    expect(isLatestFid({ pusherAction: 'foo', fid: fooFid })).toEqual(true)
    removeFid('foo')
    expect(isLatestFid({ pusherAction: 'foo', fid: fooFid })).toEqual(false)

    expect(isLatestFid({ pusherAction: 'bar', fid: barFid })).toEqual(true)
    removeFid('bar')
    expect(isLatestFid({ pusherAction: 'bar', fid: barFid })).toEqual(false)
  })

  it('can clear all cached fids', () => {
    const fooFid = createFid({ pusherAction: 'foo', prefix: 'foo' })
    const barFid = createFid({ pusherAction: 'bar', prefix: 'bar' })
    expect(isLatestFid({ pusherAction: 'foo', fid: fooFid })).toEqual(true)
    expect(isLatestFid({ pusherAction: 'bar', fid: barFid })).toEqual(true)
    clearFids()
    expect(isLatestFid({ pusherAction: 'foo', fid: fooFid })).toEqual(false)
    expect(isLatestFid({ pusherAction: 'bar', fid: barFid })).toEqual(false)
  })
})

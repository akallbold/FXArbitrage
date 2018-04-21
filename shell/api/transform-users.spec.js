import transformUsers from './transform-users'
import mockUsersResp from './mock-users-resp.json'
import mockUsersNormz from './mock-users-normalized.json'

describe('transformUsers', () => {
  it('should return an empty normalized object when passed undefined', () => {
    expect(transformUsers()).toEqual({ response: { entities: {}, result: [] } })
  })

  it('should return an empty normalized object when passed object without response key', () => {
    expect(transformUsers({})).toEqual({ response: { entities: {}, result: [] } })
  })

  it('should normalize users response', () => {
    expect(transformOrgs(mockUsersResp)).toEqual(mockusersNormz)
  })
})

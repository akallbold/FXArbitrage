import transformOrgs from './transform-orgs'
import mockOrgsResp from './mock-orgs-resp.json'
import mockOrgsNormz from './mock-orgs-normalized.json'

describe('transformOrgs', () => {
  it('should return an empty normalized object when passed undefined', () => {
    expect(transformOrgs()).toEqual({ response: { entities: {}, result: [] } })
  })

  it('should return an empty normalized object when passed object without response key', () => {
    expect(transformOrgs({})).toEqual({ response: { entities: {}, result: [] } })
  })

  it('should normalize orgs response', () => {
    expect(transformOrgs(mockOrgsResp)).toEqual(mockOrgsNormz)
  })
})

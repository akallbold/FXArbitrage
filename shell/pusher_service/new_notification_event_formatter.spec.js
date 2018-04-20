import newNotificationFormatter, { cachedDataURL, deriveServiceProviderFromAction } from './new_notification_event_formatter'
import { set, cloneDeep } from 'lodash'

const pusherData = {
  section: {
    name: 'campaign_manager_etc',
    action: 'destroy_current_users_planet',
    property: { type: 'brand', id: '1' }
  },
  payload: {
    serviceProvider: 'Snapchat',
    errors: ['error1', 'error2']
  },
  params: { fid: 'abc123' }
}

const pusherDataWithCacheKey = {
  ...pusherData,
  payload: {
    ...pusherData.payload,
    cache_key: '1dxklmjfkljdsa'
  }
}

const apiCallConfig = {
  'method': 'GET',
  'url': `${process.env.SC_API_HOST}/api/v1/notification_data/1dxklmjfkljdsa`
}

const pointer = [
  'snapchat',
  'campaignManagerEtc',
  'destroyCurrentUsersPlanet',
  'brand',
  '_1'
]

const structuredDataWithoutProperty = {
  'snapchat': {
    'campaignManagerEtc': {
      'destroyCurrentUsersPlanet': {
        'cacheKey': '1dxklmjfkljdsa',
        'data': null,
        'fid': 'abc123',
        'serviceProvider': 'Snapchat',
        'errors': ['error1', 'error2']
      }
    }
  }
}

const propertyData = {
  'brand': {
    '_1': {
      'cacheKey': '1dxklmjfkljdsa',
      'data': null,
      'fid': 'abc123',
      'serviceProvider': 'Snapchat',
      'errors': ['error1', 'error2']
    }
  }
}

const structuredData = set(cloneDeep(structuredDataWithoutProperty),
  'snapchat.campaignManagerEtc.destroyCurrentUsersPlanet',
  propertyData
)

describe('newNotificationFormatter', () => {
  describe('with cacheKey', () => {
    it('formats the data correctly', () => {
      const formattedData = newNotificationFormatter(pusherDataWithCacheKey)
      expect(formattedData.structuredData).toEqual(structuredData)
      expect(formattedData.apiCall).toMatchObject(apiCallConfig)
    })
  })

  describe('without cacheKey', () => {
    it('has null api call config and stores initial notification payload as data', () => {
      const formattedData = newNotificationFormatter(pusherData)
      let expected = set(cloneDeep(structuredData), `${pointer.join('.')}.cacheKey`, null)
      set(expected, `${pointer.join('.')}.data`, pusherData.payload)

      expect(formattedData.structuredData).toEqual(expected)
      expect(formattedData.apiCall).toBeNull()
    })
  })

  describe('without property', () => {
    it('has no property data', () => {
      const pusherDataWithoutProperty = { ...pusherDataWithCacheKey,
        section: { ...pusherDataWithCacheKey.section, property: null }
      }
      const formattedData = newNotificationFormatter(pusherDataWithoutProperty)

      expect(formattedData.structuredData).toEqual(structuredDataWithoutProperty)
    })
  })

  describe('with data', () => {
    it('has data', () => {
      const data = { hello: 'I am the data' }
      const pusherDataWithData = set(cloneDeep(pusherDataWithCacheKey), 'payload.data', data)
      const formattedData = newNotificationFormatter(pusherDataWithData)
      const structuredDataWithData = set(cloneDeep(structuredData), `${pointer.join('.')}.data`, data)

      expect(formattedData.structuredData).toEqual(structuredDataWithData)
    })
  })

  describe('when pusher data received does not need an extra cache key fetch', () => {
    it('formats data properly', () => {
      const pusherData = {
        section: {
          name: 'sc_ads_campaign_manager',
          property: {
            type: 'ad_squad',
            id: 15
          },
          action: 'sc_ads_duplicate_ads'
        },
        payload: {
          target_ad_squad_id: 15,
          success: true,
          service_provider: 'Snapchat',
          ads_duplication_result: [
            {
              ad_name: 'New Ad 2 with a new \'tude',
              ad_id: 26,
              success: true
            }
          ]
        }
      }

      const expected = {
        apiCall: null,
        fid: undefined,
        pointer: [
          'snapchat',
          'scAdsCampaignManager',
          'scAdsDuplicateAds',
          'adSquad',
          '_15'
        ],
        structuredData: {
          snapchat: {
            scAdsCampaignManager: {
              scAdsDuplicateAds: {
                adSquad: {
                  _15: {
                    cacheKey: null,
                    data: {
                      adsDuplicationResult: [
                        {
                          ad_id: 26,
                          ad_name: 'New Ad 2 with a new \'tude',
                          success: true
                        }
                      ],
                      serviceProvider: 'Snapchat',
                      success: true,
                      targetAdSquadId: 15
                    },
                    fid: undefined,
                    serviceProvider: 'Snapchat',
                    errors: null
                  }
                }
              }
            }
          }
        }
      }

      expect(newNotificationFormatter(pusherData)).toEqual(expected)
    })
  })
})

describe('cachedDataURL', () => {
  describe('with channel passed in', () => {
    it('returns the correct url', () => {
      const cacheKey = 'lalala'

      const hosts = ['facebook', 'snapchat', 'pinterest', 'twitter']

      const base = {
        facebook: `${process.env.FB_API_HOST}/api/v2/notifications/`,
        snapchat: `${process.env.SC_API_HOST}/api/v1/notification_data/`,
        pinterest: `${process.env.PT_API_HOST}/api/v2/pt_ads/notifications/`,
        twitter: `${process.env.TW_API_HOST}/api/v2/tw_ads/notifications/`
      }

      hosts.forEach(h => (
        expect(cachedDataURL(cacheKey, h)).toBe(`${base[h]}${cacheKey}`)
      ))
    })
  })

  describe('without channel passed in', () => {
    it('returns the correct url', () => {
      const cacheKey = 'lalala'
      const base = `${process.env.FB_API_HOST}/api/v2/notifications/`
      expect(cachedDataURL(cacheKey)).toBe(`${base}${cacheKey}`)
    })
  })
})

describe('deriveServiceProviderFromAction', () => {
  it('it returns snapchat', () => {
    const result = deriveServiceProviderFromAction('sc_ads_csv_imported')
    expect(result).toBe('snapchat')
  })

  it('it returns pinterest', () => {
    const result = deriveServiceProviderFromAction('pt_ads_csv_imported')
    expect(result).toBe('pinterest')
  })

  it('it returns facebook', () => {
    const result = deriveServiceProviderFromAction('fb_ads_csv_imported')
    expect(result).toBe('facebook')
  })

  it('it returns twitter', () => {
    const result = deriveServiceProviderFromAction('tw_ads_csv_imported')
    expect(result).toBe('twitter')
  })

  it('it returns undefined when input is undefined', () => {
    const result = deriveServiceProviderFromAction()
    expect(result).toBe(undefined)
  })

  it('it returns undefined when input is null', () => {
    const result = deriveServiceProviderFromAction(null)
    expect(result).toBe(undefined)
  })

  it('it returns undefined when input is an empty string', () => {
    const result = deriveServiceProviderFromAction('')
    expect(result).toBe(undefined)
  })

  it('it returns undefined when non-matching string given', () => {
    const result = deriveServiceProviderFromAction('so_twfbptallgood')
    expect(result).toBe(undefined)
  })
})

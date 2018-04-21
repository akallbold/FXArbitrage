/**
 * Mock state currently used by the `org_selectors` and `platform_selectors` test.
 * IMPORTANT! Add but don't modify. Changing whats already here may break tests. It's fine if you
 * know what you're doing and know it's okay to update snapshots, otherwise DONT MODIFY.
 *
 * If you need something different for different tests please make a new mock file.
 */

export default {
  router: {
    pathname: '/brands/1/snapchat/manager/campaigns',
    basename: '/pv',
    search: '',
    hash: '',
    query: {},
    route: '/brands/:brandId/snapchat/manager/:level(/)',
    params: {
      brandId: '1',
      level: 'campaigns'
    },
    result: {
      title: 'someTitle',
      parent: {
        route: '/brands/:brandId/snapchat'
      }
    },
    routes: {
      '/brands/:brandId/snapchat/manager/:level(/)': {
        parent: {
          route: '/brands/:brandId/snapchat'
        }
      },
      '/brands/:brandId/snapchat/manager/campaigns/:id': {
        parent: {
          route: '/brands/:brandId/snapchat'
        }
      },
      '/brands/:brandId/snapchat/manager/campaigns/:id/edit': {
        parent: {
          route: '/brands/:brandId/snapchat'
        }
      },
      '/brands/:brandId/snapchat/manager/campaigns/:id/new': {
        parent: {
          route: '/brands/:brandId/snapchat'
        }
      },
      '/brands/:brandId/snapchat/manager/adsets/:id': {
        parent: {
          route: '/brands/:brandId/snapchat'
        }
      },
      '/brands/:brandId/snapchat/manager/adsets/:id/edit': {
        parent: {
          route: '/brands/:brandId/snapchat'
        }
      },
      '/brands/:brandId/snapchat/manager/adsets/new': {
        parent: {
          route: '/brands/:brandId/snapchat'
        }
      },
      '/brands/:brandId/snapchat/manager/ads/:id': {
        parent: {
          route: '/brands/:brandId/snapchat'
        }
      },
      '/brands/:brandId/snapchat/manager/ads/:id/edit': {
        parent: {
          route: '/brands/:brandId/snapchat'
        }
      },
      '/brands/:brandId/snapchat/manager/ads/:id/new': {
        parent: {
          route: '/brands/:brandId/snapchat'
        }
      },
      '/': {
        id: 'home',
        title: 'HYFN8 - Playa',
        description: 'This is the HYFN8 Playa index page.'
      },
      '/brands/:brandId/snapchat': {},
      '/brands/:brandId(/*)': {
        match: 'matched'
      }
    },
    queue: []
  },
  platforms: {
    currentPlatform: null,
    facebook: false,
    snapchat: false,
    twitter: false,
    pinterest: false,
    error: null,
    loading: false
  },
  brandSwitcher: {
    isOpen: true
  },
  sideNav: {
    showSideNav: true
  },
  accountMenu: {
    hidden: true
  },
  pusherData: {},
  entities: {
    aclUser: {
      data: {
        id: 1,
        firstName: 'HYFN',
        lastName: 'McHYFN',
        email: 'test@hyfn8.com',
        currentStep: 'complete',
        phone: null,
        personalCompany: null,
        department: null,
        jobTitle: null,
        invitationCode: 'c42934dad03123eec6133e188d16a453e4eec4d478d41de54d9e138b3fa73043',
        language: null,
        timeZone: null,
        signUpThumb: '/assets/default_avatar.png',
        avatar: {
          url: '/assets/default_avatar.png',
          thumb50x50Url: '/assets/default_avatar.png',
          thumbUrl: '/assets/default_avatar.png',
          signUpThumb: '/assets/default_avatar.png'
        },
        organizations: [
          {
            id: 1,
            name: 'Mullen',
            type: 'group',
            roles: [
              'roles/administrator'
            ],
            usersCount: 2
          }
        ],
        isHyfn8Admin: true,
        authenticationToken: 'WMKz4xHnQunpoaEMA1pJ',
        accessToken: 'WMKz4xHnQunpoaEMA1pJ',
        invitationPending: false,
        profiles: []
      },
      loading: false,
      error: null
    },
    aclOrgs: {
      data: {
        entities: {
          brands: {
            '1': {
              id: 1,
              name: 'Nike/Football',
              type: 'brand',
              roles: [
                'administrator'
              ],
              companyId: 1,
              advertisingPages: false,
              advertisingState: 'ready',
              twAdvertisingState: 'waiting_on_hyfn8',
              twAdvertisingStateReady: true,
              ptAdvertisingEnabled: true,
              scAdvertisingEnabled: true
            },
            '2': {
              id: 2,
              name: 'Nike/Baseball',
              type: 'brand',
              roles: [
                'administrator'
              ],
              companyId: 1,
              advertisingPages: false,
              advertisingState: 'not ready',
              twAdvertisingState: 'waiting_on_hyfn8',
              twAdvertisingStateReady: false,
              ptAdvertisingEnabled: false,
              scAdvertisingEnabled: false
            },
            '3': {
              id: 3,
              name: 'Explora EasiFlow',
              type: 'brand',
              roles: [
                'administrator'
              ],
              companyId: 2,
              advertisingPages: false,
              advertisingState: 'ready',
              twAdvertisingState: 'waiting_on_hyfn8',
              twAdvertisingStateReady: false,
              ptAdvertisingEnabled: false,
              scAdvertisingEnabled: false
            },
            '4': {
              id: 4,
              name: 'Sippee Cups',
              type: 'brand',
              roles: [
                'administrator'
              ],
              companyId: 2,
              advertisingPages: false,
              advertisingState: 'ready',
              twAdvertisingState: 'waiting_on_hyfn8',
              twAdvertisingStateReady: false,
              ptAdvertisingEnabled: false,
              scAdvertisingEnabled: false
            },
            '5': {
              id: 5,
              name: 'FB Test Brand',
              type: 'brand',
              roles: [
                'administrator'
              ],
              companyId: 3,
              advertisingPages: true,
              advertisingState: 'ready',
              twAdvertisingState: 'waiting_on_hyfn8',
              twAdvertisingStateReady: false,
              ptAdvertisingEnabled: false,
              scAdvertisingEnabled: false
            }
          },
          companies: {
            '1': {
              id: 1,
              type: 'company',
              name: 'Nike',
              brands: [
                1,
                2
              ],
              roles: [
                'administrator'
              ]
            },
            '2': {
              id: 2,
              type: 'company',
              name: 'Tommee Tippee',
              brands: [
                3,
                4
              ],
              roles: [
                'administrator'
              ]
            },
            '3': {
              id: 3,
              type: 'company',
              name: 'Will Co',
              brands: [
                5
              ],
              roles: [
                'administrator'
              ]
            }
          },
          groups: {
            '1': {
              id: 1,
              type: 'group',
              name: 'Mullen',
              companies: [
                1,
                2,
                3
              ],
              roles: [
                'administrator'
              ]
            }
          }
        },
        result: [
          1
        ]
      },
      loading: false,
      error: null
    },
    scCampaigns: {
      data: {
        campaigns: [
          { id: '420', name: 'Campaign Name Here' },
          { id: '421', name: 'Another Campaign Name Here' }
        ]
      }
    }
  },
  snapChat: {
    form: {}
  }
}

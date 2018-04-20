import { cloneDeep } from 'lodash'
import catchall, {
  makePattern,
  patternIterator,
  makePatterns,
  hasMatch,
  patterns
} from './CatchAll.middleware'
import { setErrorPage } from './CatchAll.actions'
import { TYPE_404 } from './CatchAll.pages'

const store = {
  getState: () => ({
    router: {
      pathname: '/brands/1/snapchat/manager/campaigns',
      basename: '/playa',
      search: '',
      hash: '',
      query: {},
      route: '/brands/:brandId/snapchat/manager/:level(/)',
      params: {
        brandId: '1',
        level: 'campaigns'
      }
    }
  })
}

const createRouteChangeAction = ({ pathname, route }) => ({
  type: 'ROUTER_LOCATION_CHANGED',
  payload: {
    query: {
      endDate: '2018-01-07',
      startDate: '2018-01-07'
    },
    search: '',
    options: {},
    pathname,
    hash: '',
    key: 'wb373h',
    route,
    params: {},
    result: {
      parent: {
        // route: '/brands/:brandId/facebook'
      }
    }
  }
})

const segmentParams = {
  brandId: '420',
  id: '200',
  section: 'creatives',
  level: 'campaigns'
}

const action404 = setErrorPage({ errorType: TYPE_404 })

const urlsExpected404 = [
  '/brandzzz',
  '/brands',
  '/brands/420',
  '/brands/420/foobar',
  '/brands/420/undefined',
  '/brands/420/undefined/manager',
  '/brands/420/undefined/manager/campaigns',
  '/brands/420/snapchat/foobar',
  '/brands/420/facebook/foobar',
  '/brands/420/twitter/foobar',
  '/brands/420/pinterest/foobar'
]

const homeRoute = '/'
const homeMetaData = {
  id: 'home',
  title: 'HYFN8 - Do Social Better',
  description: 'This is the HYFN8 homepage.'
}

const snapchatBaseRoute = '/brands/:brandId/snapchat'
const snapchatRoutes = {
  '/manager/campaigns/:id': { title: 'Campaign' },
  '/manager/campaigns/:id/edit': {},
  '/manager/campaigns/new': { title: 'Create Campaign' },
  '/manager/adsets/:id': {},
  '/manager/adsets/:id/edit': { title: 'Edit Ad Set' },
  '/manager/adsets/new': { title: 'Create Ad Set' },
  '/manager/ads/:id': {},
  '/manager/ads/:id/edit': { title: 'Edit Ad' },
  '/manager/ads/new': { title: 'Create Ad' },
  '/assets/:section': { title: 'Assets' },
  '/assets/creatives/new': { title: 'Create Creative' },
  '/manager/:level(/*)': {}
}

const urlsExpectedMatch = patterns.map(pattern => pattern.stringify(segmentParams))

describe('catchall redux middleware', () => {
  it(`should 404 on these urls:\n\t${urlsExpected404.join('\n\t')}`, () => {
    urlsExpected404.forEach(pathname => {
      const next = jest.fn()
      catchall(store)(next)(createRouteChangeAction({ pathname }))
      expect(next).toHaveBeenCalledWith(action404)
    })
  })

  it(`should match on all these urls:\n\t${urlsExpectedMatch.join('\n\t')}`, () => {
    urlsExpectedMatch.forEach(pathname => {
      const next = jest.fn()
      const action = createRouteChangeAction({ pathname })
      catchall(store)(next)(action)
      expect(next).toHaveBeenCalledWith(action)
    })
  })
})

describe('makePattern', () => {
  it('should make url pattern object with a `route` property', () => {
    const urlPattern = makePattern('/someurl/pattern/:here')
    expect(urlPattern.route).toEqual('/someurl/pattern/:here')
  })

  it('should make url pattern object with a match method that works', () => {
    const urlPattern = makePattern('/someurl/pattern/:here')
    expect(urlPattern.match('/someurl/pattern/paramIsHere')).toEqual({ here: 'paramIsHere' })
  })
})

describe('patternIterator factory', () => {
  it('should not include the home route', () => {
    const patternIteratorFunc = patternIterator('')
    const result = patternIteratorFunc([], [homeRoute, homeMetaData])
    // console.log('result: ', result)
    expect(result).toEqual([])
  })

  it('should prepend parent route to each child route', () => {
    const patternIteratorFunc = patternIterator('')
    const result = patternIteratorFunc([], [snapchatBaseRoute, snapchatRoutes])
    expect(result[1].route.indexOf(snapchatBaseRoute)).toEqual(0)
  })

  it('should prepend string provided to each route', () => {
    const patternIteratorFunc = patternIterator('/this/should/be/prepended')
    const result = patternIteratorFunc([], [snapchatBaseRoute, snapchatRoutes])
    expect(result[1].route.indexOf('/this/should/be/prepended')).toEqual(0)
  })

  it('should be recursive', () => {
    const patternIteratorFunc = patternIterator('')
    const result = patternIteratorFunc([], [snapchatBaseRoute, snapchatRoutes])
    expect(result.length).toEqual(13)
  })
})

describe('makePatterns', () => {
  it('should not mutate', () => {
    const routes = {
      [homeRoute]: homeMetaData,
      [snapchatBaseRoute]: snapchatRoutes
    }
    const routesClone = cloneDeep(routes)
    makePatterns('', routes, [])
    expect(routes).toEqual(routesClone)
  })

  it('should not include the home route', () => {
    const result = makePatterns('', {
      [homeRoute]: homeMetaData,
      [snapchatBaseRoute]: snapchatRoutes
    }, [])
    expect(result.map(pattern => pattern.route)).not.toEqual(expect.arrayContaining(['/']))
  })

  it('should prepend parent route to each child route', () => {
    const result = makePatterns('', {
      [snapchatBaseRoute]: snapchatRoutes
    }, [])
    expect(result[1].route.indexOf(snapchatBaseRoute)).toEqual(0)
  })

  it('should prepend string provided to each route', () => {
    const result = makePatterns('/this/should/be/prepended', {
      [snapchatBaseRoute]: snapchatRoutes
    }, [])
    expect(result[1].route.indexOf('/this/should/be/prepended')).toEqual(0)
  })

  it('should be super recursive', () => {
    const result = makePatterns('', {
      '/some': {
        '/parent': {
          '/route': {
            [snapchatBaseRoute]: snapchatRoutes
          }
        },
        '/other': {
          '/parent': {
            '/route': {
              stuff: 'here'
            }
          }
        }
      }
    }, [])
    expect(result.length).toEqual(19)
  })
})

describe('hasMatch', () => {
  it('should find a match for a basic pattern', () => {
    const result = makePatterns('', {
      [snapchatBaseRoute]: snapchatRoutes
    }, [])
    expect(hasMatch(result, '/brands/420/snapchat/manager/campaigns/200'))
      .toEqual(true)
  })

  it('should not find a match for basic pattern', () => {
    const result = makePatterns('', {
      [snapchatBaseRoute]: snapchatRoutes
    }, [])
    expect(hasMatch(result, '/brands/420/snapchat/foo'))
      .toEqual(false)
  })

  it('should ignore the query string in the pathname', () => {
    const result = makePatterns('', {
      [snapchatBaseRoute]: snapchatRoutes
    }, [])
    expect(hasMatch(result, '/brands/420/snapchat/manager/ads?adsets=327'))
      .toEqual(true)
  })
})

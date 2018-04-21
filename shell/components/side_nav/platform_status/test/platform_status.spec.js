import React from 'react'
import PropTypes from 'prop-types'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import configureMockStore from 'redux-mock-store'
import { PLATFORM_NAMES } from 'constants/platform'
import {
  PlatformStatus,
  PlatformStatusItem,
  platformLinkData,
  platformClickHandler
} from 'components/side_nav/platform_status/platform_status'

describe('<PlatformStatus />', () => {
  const mockStore = configureMockStore()
  const store = mockStore({ router: {} })
  const platformStatuses = {
    currentPlatform: 'snapchat',
    facebook: false,
    snapchat: true,
    twitter: false,
    pinterest: true,
    error: null,
    loading: false
  }

  const options = {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired }
  }

  const platformIdsOrder = [
    PLATFORM_NAMES.FACEBOOK,
    PLATFORM_NAMES.TWITTER,
    PLATFORM_NAMES.PINTEREST,
    PLATFORM_NAMES.SNAPCHAT
  ]

  it('should have platforms in correct order', () => {
    const platformIds = platformLinkData.map(item => item.id)
    expect(platformIds).toEqual(platformIdsOrder)
  })

  it('should render properly given props', () => {
    const component = mount(
      <PlatformStatus
        platformStatuses={platformStatuses}
        currentBrandId={'5'}
        selectedChannel={'pinterest'}
      />,
      options
    )
    expect(toJson(component)).toMatchSnapshot()
  })
})

describe('<PlatformStatusItem />', () => {
  it('should render properly given props', () => {
    const itemData = platformLinkData[0]
    const component = shallow(
      <PlatformStatusItem {...itemData} status />
    )

    expect(toJson(component)).toMatchSnapshot()
  })
})

describe('platformClickHandler', () => {
  describe('for same channel', () => {
    it('should return a preventDefault function click handler', () => {
      const clickHandler = platformClickHandler({ selectedChannel: 'pinterest', channelName: 'pinterest' })
      expect(clickHandler).toBeInstanceOf(Function)
    })
  })

  describe('for different channel', () => {
    it('should return a null click handler', () => {
      const clickHandler = platformClickHandler({ selectedChannel: 'pinterest', channelName: 'facebook' })
      expect(clickHandler).toEqual(null)
    })
  })
})

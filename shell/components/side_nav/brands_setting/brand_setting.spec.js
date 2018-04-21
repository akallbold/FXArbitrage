import React from 'react'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { BrandSetting, BrandSettingStatusItem, BRAND_SETTING_NAMES } from './brand_setting'

describe('BRAND_SETTING_NAMES', () => {
  it('should have the platform names in the correct order', () => {
    expect(BRAND_SETTING_NAMES).toEqual(['account info', 'ad pixel', 'connected properties'])
  })
})

describe('<BrandSetting />', () => {
  it('should render properly given props', () => {
    const component = mount(
      <BrandSetting BrandSettingStatuses={['account info', 'ad pixel', 'connected properties']} />
    )
    expect(toJson(component)).toMatchSnapshot()
  })
})

describe('<BrandSettingStatusItem />', () => {
  it('should render properly given props', () => {
    const component = shallow(
      <BrandSettingStatusItem name='account info' />
    )
    expect(toJson(component)).toMatchSnapshot()
  })
})

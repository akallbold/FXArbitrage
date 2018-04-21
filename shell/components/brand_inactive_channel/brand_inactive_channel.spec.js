import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { BrandInactiveChannel, CheckBrandChannelActive } from './brand_inactive_channel'

describe('<CheckBrandChannelActive />', () => {
  it('renders the children when brandHasChannel is true', () => {
    const component = shallow(
      <CheckBrandChannelActive brandHasChannel>
        <div id='child'>We are the children</div>
      </CheckBrandChannelActive>
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('renders the BrandInactiveChannel when brandHasChannel is false', () => {
    const component = shallow(
      <CheckBrandChannelActive channel='twitter'>
        <div id='child'>We are the children</div>
      </CheckBrandChannelActive>
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('renders loading modal when orgs are loading', () => {
    const component = shallow(
      <CheckBrandChannelActive orgsLoadingStatus>
        <div id='child'>We are the children</div>
      </CheckBrandChannelActive>
    )
    expect(toJson(component)).toMatchSnapshot()
  })
})

describe('<BrandInactiveChannel />', () => {
  it('renders', () => {
    const component = shallow(<BrandInactiveChannel channel='twitter' />)
    expect(toJson(component)).toMatchSnapshot()
  })
})

import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import BreadCrumbLink from './bread_crumb_link'

describe('<BreadCrumbLink />', () => {
  it('renders', () => {
    const breadCrumbLink = <BreadCrumbLink
      brandId='5'
      channel='snapchat'
      childrenLevel='adsets'
      name='My Cool Selected Campaign'
    />
    const wrapper = shallow(breadCrumbLink)

    expect(toJson(wrapper)).toMatchSnapshot()
  })
})

import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Page404 from './Page404'

describe('<Page404 />', () => {
  it('should render properly given all props', () => {
    const component = shallow(
      <Page404 prevPathname='some/path/here' />
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should render a button with prevPathname as href', () => {
    const component = shallow(
      <Page404 prevPathname='some/path/here' />
    )
    expect(component.find('Button').prop('href')).toEqual('some/path/here')
  })

  it('should render a message instead of button with undefined prevPathname', () => {
    const component = shallow(<Page404 />)

    expect(component.find('Button').length).toEqual(0)
    expect(component.find('.message').length).toEqual(2)
  })
})

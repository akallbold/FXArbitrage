import React from 'react'
import { mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import SideNavToggler from './side_nav_toggler'

const mockStore = configureMockStore()

describe('<SideNav />', () => {
  const store = mockStore({ sideNav: { showSideNav: false } })
  const wrapper = mount(<SideNavToggler store={store} />)

  it('should render the component with a closed side nav', () => {
    expect(wrapper.text()).toEqual('Show Menu')
  })
})

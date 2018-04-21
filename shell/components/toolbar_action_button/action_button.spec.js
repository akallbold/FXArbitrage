import React from 'react'
import { ActionButtonComponent } from 'toolbar_action_button/action_button'
import { shallow } from 'enzyme'

describe('render', () => {
  it('renders the component as expected', () => {
    const wrapper = shallow(<ActionButtonComponent />)

    expect(wrapper).toMatchSnapshot()
  })
})

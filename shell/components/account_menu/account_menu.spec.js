import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { AccountMenu } from './account_menu'

const user = {
  firstName: 'Horse',
  lastName: 'Badorties',
  email: 'horse.badorties@thefanman.com'
}

const func = () => {}

describe('<AccountMenu />', () => {
  it('should render given no props', () => {
    const component = shallow(
      <AccountMenu />
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should render given all props', () => {
    const component = shallow(
      <AccountMenu
        isHidden
        user={user}
        showAccountMenu={func}
        hideAccountMenu={func}
        viewProfile={func}
        redirectToHelp={func}
        signOut={func}
      />
    )
    expect(toJson(component)).toMatchSnapshot()
  })
})

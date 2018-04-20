import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { CatchAllPage } from './CatchAllPage'
import { TYPE_404 } from './CatchAll.pages'

describe('<CatchAllPage />', () => {
  it('should render properly given all props', () => {
    const component = shallow(
      <CatchAllPage
        type={TYPE_404}
        prevPathname='some/path/here'
      />
    )
    expect(toJson(component)).toMatchSnapshot()
  })
})

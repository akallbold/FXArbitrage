import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { ArrowBox } from './channel_toolbar_arrow_box'

import {
  TWITTER,
  FACEBOOK,
  PINTEREST
} from './shared_constants'

describe('ArrowBox', () => {
  const activeChannels = [TWITTER, FACEBOOK, PINTEREST]

  it('renders correctly when snapchat', () => {
    const rapper = shallow(<ArrowBox channel='snapchat' activeChannels={activeChannels} />)
    expect(toJson(rapper)).toMatchSnapshot()
  })

  it('renders correctly when facebook', () => {
    const rapper = shallow(<ArrowBox channel='facebook' activeChannels={activeChannels} />)
    expect(toJson(rapper)).toMatchSnapshot()
  })

  it('renders correctly when twitter', () => {
    const rapper = shallow(<ArrowBox channel='twitter' activeChannels={activeChannels} />)
    expect(toJson(rapper)).toMatchSnapshot()
  })

  it('renders correctly when pinterest', () => {
    const rapper = shallow(<ArrowBox channel='pinterest' activeChannels={activeChannels} />)
    expect(toJson(rapper)).toMatchSnapshot()
  })

  it('renders with a title if there is a title', () => {
    const singer = shallow(<ArrowBox channel='snapchat' activeChannels={activeChannels} title='title' />)
    expect(toJson(singer)).toMatchSnapshot()
    expect(singer.find('.title').exists()).toBe(true)
  })
})

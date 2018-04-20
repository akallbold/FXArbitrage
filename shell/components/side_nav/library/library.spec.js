import MENU_LIBRARY_CONTENT from './library_menu_constants'

describe('MENU_LIBRARY_CONTENT', () => {
  it('should have the correct length of main menus', () => {
    expect(Object.keys(MENU_LIBRARY_CONTENT)).toEqual(['facebook', 'pinterest', 'snapchat'])
  })
})

// describe('<Library />', () => {
//   it('should render properly given props', () => {
//     const component = mount(
//       <Library currentBrandId='1' level='' selectedChannel='snapchat' />
//     )
//     expect(toJson(component)).toMatchSnapshot()
//   })
// })

// describe('<LibraryStatusItem />', () => {
//   it('should render properly given props', () => {
//     const component = shallow(
//       <LibraryStatusItem name="assets" />
//     )
//     expect(toJson(component)).toMatchSnapshot()
//   })
// })

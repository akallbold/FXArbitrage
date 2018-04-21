import { PLATFORM_NAMES } from 'constants/platform'

const FB_MENU_LIBRARY_CONTENT = [
  {
    name: 'assets',
    urlId: 'assets',
    subMenu: [
      {
        name: 'Images',
        urlId: 'images'
      },
      {
        name: 'Videos',
        urlId: 'videos'
      }
    ]
  },
  {
    name: 'audiences',
    urlId: 'audiences',
    subMenu: [
      {
        name: 'Custom Audiences',
        urlId: 'custom-audiences'
      },
      {
        name: 'Targeting Groups',
        urlId: 'targeting-groups'
      }
    ]
  },
  {
    name: 'studies',
    urlId: 'studies',
    subMenu: [
      {
        name: 'Split Studies',
        urlId: 'split-study'
      }
    ]
  }
]

const PT_MENU_LIBRARY_CONTENT = [
  {
    name: 'assets',
    urlId: 'assets',
    subMenu: [
      {
        name: 'Pins',
        urlId: 'pins'
      },
      {
        name: 'Videos',
        urlId: 'videos'
      }
    ]
  },
  {
    name: 'audiences',
    urlId: 'audiences',
    subMenu: [
      {
        name: 'Targeting Groups',
        urlId: 'targeting-groups'
      },
      {
        name: 'Audiences',
        urlId: 'audiences'
      }
    ]
  },
  {
    name: 'conversion tags',
    urlId: 'conversion-tags',
    subMenu: [
      {
        name: 'Version 3 tags',
        urlId: 'version-3-tags'
      }
    ]
  }
]

const SC_MENU_LIBRARY_CONTENT = [
  {
    name: 'assets',
    urlId: 'assets',
    subMenu: [
      {
        name: 'Creatives',
        urlId: 'creatives'
      },
      {
        name: 'Images',
        urlId: 'images'
      },
      {
        name: 'Videos',
        urlId: 'videos'
      }
    ]
  }
]

const MENU_LIBRARY_CONTENT = {
  [PLATFORM_NAMES.FACEBOOK]: FB_MENU_LIBRARY_CONTENT,
  [PLATFORM_NAMES.PINTEREST]: PT_MENU_LIBRARY_CONTENT,
  [PLATFORM_NAMES.SNAPCHAT]: SC_MENU_LIBRARY_CONTENT
}

export default MENU_LIBRARY_CONTENT

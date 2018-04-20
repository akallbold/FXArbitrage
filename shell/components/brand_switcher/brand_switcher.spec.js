import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { BrandSwitcher } from './brand_switcher'
import {
  BrandsMenu,
  BrandsMenuList,
  createBrandUrl,
  formatListData,
  filterBrands
} from './brands_menu'
import { BrandMenuItem } from './brand_menu_item'

const nikeFootball = { id: 1, name: 'Nike/Football', companyId: 1, isSelected: true, companyName: 'Nike' }
const nikeBaseball = { id: 2, name: 'Nike/Baseball', companyId: 1, isSelected: false, companyName: 'Nike' }
const explora = { id: 3, name: 'Explora EasiFlow', companyId: 2, isSelected: false, companyName: 'Tommee Tippee' }
const sasquatch = { id: 4, name: 'Sasquatch', companyId: 3, isSelected: false, companyName: 'Baby Goat Wings' }
const sippee = { id: 5, name: 'Sippee Cups', companyId: 2, isSelected: false, companyName: 'Tommee Tippee' }
const furp = { id: 6, name: 'Furp', companyId: 3, isSelected: false, companyName: 'Baby Goat Wings' }
const babyGoatWings = { id: 7, name: 'Baby Goat Wings', companyId: 3, isSelected: false, companyName: 'Baby Goat Wings' }

const formattedBrands = [
  { label: 'Baby Goat Wings', isHeading: true, orgId: 3, orgType: 'company' },
  { label: 'Baby Goat Wings', hrefPathname: '/brands/7/facebook/manager/campaigns', isSelected: false, orgId: 7, orgType: 'brand' },
  { label: 'Furp', hrefPathname: '/brands/6/facebook/manager/campaigns', isSelected: false, orgId: 6, orgType: 'brand' },
  { label: 'Sasquatch', hrefPathname: '/brands/4/facebook/manager/campaigns', isSelected: false, orgId: 4, orgType: 'brand' },
  { label: 'Nike', isHeading: true, orgId: 1, orgType: 'company' },
  { label: 'Nike/Baseball', hrefPathname: '/brands/2/facebook/manager/campaigns', isSelected: false, orgId: 2, orgType: 'brand' },
  { label: 'Nike/Football', hrefPathname: '/brands/1/facebook/manager/campaigns', isSelected: true, orgId: 1, orgType: 'brand' },
  { label: 'Tommee Tippee', isHeading: true, orgId: 2, orgType: 'company' },
  { label: 'Explora EasiFlow', hrefPathname: '/brands/3/facebook/manager/campaigns', isSelected: false, orgId: 3, orgType: 'brand' },
  { label: 'Sippee Cups', hrefPathname: '/brands/5/facebook/manager/campaigns', isSelected: false, orgId: 5, orgType: 'brand' }
]

const brands = [
  { ...nikeFootball },
  { ...nikeBaseball },
  { ...explora },
  { ...sasquatch },
  { ...sippee },
  { ...furp },
  { ...babyGoatWings }
]

const isOpen = true
const openBrandSwitcher = () => {}
const closeBrandSwitcher = () => {}

describe('<BrandSwitcher />', () => {
  it('should render properly given all props', () => {
    const component = shallow(
      <BrandSwitcher {...{ brands, isOpen, openBrandSwitcher, closeBrandSwitcher }} />
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should render with `brandName` over `label` if available', () => {
    const component = shallow(
      <BrandSwitcher {...{ brands, label: 'Fallback Label', isOpen, openBrandSwitcher, closeBrandSwitcher }} />
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should render with fallback `label` given empty `brands`', () => {
    const component = shallow(
      <BrandSwitcher {...{ brands: [], label: 'Fallback Label', isOpen, openBrandSwitcher, closeBrandSwitcher }} />
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should render properly given empty `brands` AND no `label`', () => {
    const component = shallow(
      <BrandSwitcher {...{ brands: [], label: void 0, isOpen, openBrandSwitcher, closeBrandSwitcher }} />
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should render properly given `isOpen` is false', () => {
    const component = shallow(
      <BrandSwitcher {...{ brands, isOpen: false, openBrandSwitcher, closeBrandSwitcher }} />
    )
    expect(toJson(component)).toMatchSnapshot()
  })
})

describe('<BrandsMenu />', () => {
  const currentProps = {
    brands
  }

  const menu = (<BrandsMenu {...{ brands }} />)
  const component = shallow(menu)

  it('should render properly given all props', () => {
    expect(toJson(component)).toMatchSnapshot()
  })

  describe('componentWillReceiveProps', () => {
    it('should update if brands are not equal', () => {
      const component = shallow(menu)
      const inst = component.instance()
      const spy = jest.spyOn(inst, 'updateFilteredBrands')
      const nextNikeFootball = {
        ...nikeFootball,
        isSelected: false
      }
      const nextNikeBaseball = {
        ...nikeBaseball,
        isSelected: true
      }
      const nextBrands = [
        { ...nextNikeFootball },
        { ...nextNikeBaseball },
        { ...explora },
        { ...sasquatch },
        { ...sippee },
        { ...furp },
        { ...babyGoatWings }
      ]
      const nextProps = {
        ...currentProps,
        brands: nextBrands
      }
      inst.componentWillReceiveProps(nextProps)
      expect(spy).toHaveBeenCalled()
    })

    it('should NOT update if brands are the same', () => {
      const component = shallow(menu)
      const inst = component.instance()
      const spy = jest.spyOn(inst, 'updateFilteredBrands')
      const nextProps = { ...currentProps }
      inst.componentWillReceiveProps(nextProps)
      expect(spy).not.toHaveBeenCalled()
    })
  })
})

describe('filterBrands', () => {
  it('filterBrands should NOT mutate brands array', () => {
    filterBrands({ brands, query: 'nike' })
    expect(brands).toEqual(brands)
  })

  it('filterBrands should NOT mutate brands objects', () => {
    const filteredBrands = filterBrands({ brands, query: '' })
    filteredBrands[0].name = 'Mutated'
    expect(filteredBrands[0].name).not.toEqual(brands[0].name)
  })

  it('filterBrands should filter out irrelevant brands', () => {
    const expected = [{ ...nikeFootball }, { ...nikeBaseball }]
    const filteredBrands = filterBrands({ brands, query: 'nike' })
    expect(filteredBrands).toEqual(expected)
  })

  it('filterBrands should filter out no brands with \'\'', () => {
    const filteredBrands = filterBrands({ brands, query: '' })
    expect(filteredBrands).toEqual(brands)
  })

  it('filterBrands should filter out no brands with null', () => {
    const filteredBrands = filterBrands({ brands, query: null })
    expect(filteredBrands).toEqual(brands)
  })

  it('filterBrands should filter out no brands with undefined', () => {
    const filteredBrands = filterBrands({ brands, query: void 0 })
    expect(filteredBrands).toEqual(brands)
  })

  it('filterBrands should return empty Array when no matches', () => {
    const filteredBrands = filterBrands({ brands, query: 'wefwef' })
    expect(filteredBrands).toEqual([])
  })
})

describe('createBrandUrl', () => {
  it('should make a url based on active brand in pecking order', () => {
    const brandUrlFB = createBrandUrl({
      id: 149,
      advertisingState: 'ready',
      twAdvertisingStateReady: true,
      ptAdvertisingEnabled: false,
      scAdvertisingEnabled: false
    })
    expect(brandUrlFB.includes('/facebook')).toEqual(true)

    const brandUrlTW = createBrandUrl({
      id: 149,
      advertisingState: 'waiting_on_hyfn8',
      twAdvertisingStateReady: true,
      ptAdvertisingEnabled: false,
      scAdvertisingEnabled: false
    })
    expect(brandUrlTW.includes('/twitter')).toEqual(true)
  })

  it('should default to facebook if no active channel', () => {
    const brandUrlNone = createBrandUrl({
      id: 149,
      advertisingState: 'waiting_on_hyfn8',
      twAdvertisingStateReady: false,
      ptAdvertisingEnabled: false,
      scAdvertisingEnabled: false
    })
    expect(brandUrlNone.includes('/facebook')).toEqual(true)
  })
})

describe('formatListData', () => {
  it('formatListData should NOT mutate brands array', () => {
    formatListData(brands)
    expect(brands).toEqual(brands)
  })

  it('formatListData should NOT mutate brands objects', () => {
    const formattedList = formatListData(brands)
    formattedList[0].label = 'Mutated'
    expect(formattedList[0].label).not.toEqual(brands[0].companyName)
  })

  it('formatListData should format properly', () => {
    const formattedList = formatListData(brands)
    expect(formattedList).toEqual(formattedBrands)
  })
})

describe('<BrandsMenuList />', () => {
  it('should render properly given all props', () => {
    const component = shallow(
      <BrandsMenuList brands={formattedBrands} />
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should render no results message given empty brands', () => {
    const component = shallow(
      <BrandsMenuList brands={[]} query='testing' />
    )
    expect(toJson(component)).toMatchSnapshot()
  })
})

describe('<BrandMenuItem />', () => {
  it('should render a heading if `isHeading` is true', () => {
    const component = shallow(
      <BrandMenuItem {...formattedBrands[0]} />
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should render a menu item if `isHeading` is false', () => {
    const component = shallow(
      <BrandMenuItem {...formattedBrands[2]} />
    )
    expect(toJson(component)).toMatchSnapshot()
  })

  it('should render a menu item with selected class if `isSelected` is true', () => {
    const component = shallow(
      <BrandMenuItem {...formattedBrands[1]} />
    )
    expect(toJson(component)).toMatchSnapshot()
  })
})

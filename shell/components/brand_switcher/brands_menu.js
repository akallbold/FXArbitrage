import React from 'react'
import PropTypes from 'prop-types'
import { isEqual, uniqWith, sortBy, get, set } from 'lodash'
import { push } from 'redux-little-router'
import { connect } from 'react-redux'
import { SearchInput } from 'playa-styleguide'
import { findActiveChannelForABrand } from 'sagas/system_sagas'
import BrandMenuItem from './brand_menu_item'
import Styles from './brands_menu.css'

export const sortForBrandMenu = brands => sortBy(brands, ['companyName', 'companyId', 'name', 'id'])

export const createBrandUrl = (brand) => {
  const brandChannel = findActiveChannelForABrand([brand])
  if (brandChannel) {
    return `/brands/${brandChannel.brandId}/${brandChannel.channel || 'facebook'}/manager/campaigns`
  }
  return `/brands/${brand.id}/facebook/manager/campaigns`
}

/**
 * Format the brands data for the `BrandMenuItems` component.
 * @param  {Array}  brands  Array of the brands as is from the `brandsForSwitcher` selector.
 * @return {Array}          Copy of brands formatted for the menu items.
 */
export const formatListData = (brands = []) => (
  uniqWith(sortForBrandMenu(brands).reduce((acc, brand) => {
    acc.push({
      label: brand.companyName,
      isHeading: true,
      orgId: brand.companyId,
      orgType: 'company'
    })
    acc.push({
      label: brand.name,
      hrefPathname: createBrandUrl(brand),
      isSelected: brand.isSelected,
      orgId: brand.id,
      orgType: 'brand'
    })
    return acc
  }, []), isEqual)
)

/**
 * Filters the formatted brands array.
 * @param  {Array} brands  Array of brands that have already been formatted for the
 *                         `BrandMenuItems` component.
 * @param  {String} query  String to filter on.
 * @return {Array}         Copy of formatted brands with irrelevant brands removed.
 */
export const filterBrands = ({ brands, query }) => (
  brands.reduce((acc, brand) => {
    const matched = brand.name.toLowerCase().includes((query || '').toLowerCase())
    if (matched) acc.push({ ...brand })
    return acc
  }, [])
)

export class BrandsMenuList extends React.Component {
  constructor (props) {
    super(props)
    this.listItemRefs = []
  }

  componentWillUpdate () {
    const currEle = get(this.listItemRefs, [this.props.arrowKeyedToIndex])

    const currTopPosition = get(this.wrapper, 'scrollTop')
    const selectedPosition = get(currEle, 'offsetTop')

    const downScrollOffset = (
      (selectedPosition + get(currEle, 'offsetHeight')) - currTopPosition - get(this.wrapper, 'clientHeight')
    )
    const upScrollOffset = selectedPosition - currTopPosition

    if (downScrollOffset > 0 && !isNaN(downScrollOffset)) {
      set(this.wrapper, 'scrollTop', currTopPosition + downScrollOffset)
    } else if (upScrollOffset < 0 && !isNaN(upScrollOffset)) {
      set(this.wrapper, 'scrollTop', currTopPosition + upScrollOffset)
    }
  }

  render () {
    const { brands = [], query, arrowKeyedToIndex } = this.props

    return (
      <div ref={(ele) => { this.wrapper = ele }} className={Styles.brandsList}>
        {brands.length > 0 &&
          brands.map((brand, index) => {
            return (
              <BrandMenuItem
                itemRef={(ele) => { this.listItemRefs[index] = ele }}
                {...brand}
                arrowKeyedTo={arrowKeyedToIndex === index}
                key={`${brand.orgType}-${brand.orgId}`}
              />
            )
          })
        }
        {brands.length === 0 &&
          <h4 className={Styles.noResults}>Sorry, no results for &quot;{query}&quot;</h4>
        }
      </div>
    )
  }
}

BrandsMenuList.defaultProps = {
  arrowKeyedToIndex: 0,
  query: ''
}

BrandsMenuList.propTypes = {
  arrowKeyedToIndex: PropTypes.number,
  query: PropTypes.string
}

/**
 * Brands Menu container
 */
export class BrandsMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // NOTE: This first iteration the list isn't actually filtered yet.
      filteredFormattedBrands: formatListData(props.brands),
      curQuery: '',
      arrowKeyedToIndex: 0
    }
  }

  componentDidMount () {
    this.searchInput.textInput.focus()
    this.setState({ arrowKeyedToIndex: 0 })
  }

  componentWillReceiveProps (nextProps) {
    if (this.shouldUpdateFilteredBrands(nextProps)) {
      const { brands } = nextProps
      this.setState({ arrowKeyedToIndex: 0 })
      this.updateFilteredBrands({ brands })
    }
  }

  onQueryChange = (query) => {
    const { brands } = this.props
    this.updateFilteredBrands({ brands, query })
  }

  updateFilteredBrands = ({ brands, query }) => {
    const filteredBrands = !query ? brands : filterBrands({ brands, query })
    this.setState({
      filteredFormattedBrands: formatListData(filteredBrands),
      curQuery: query
    })
  }

  shouldUpdateFilteredBrands = (nextProps) => {
    if (!isEqual(nextProps.brands, this.props.brands)) return true
    return false
  }

  onKeyPress = (event) => {
    if (event.key === 'Enter') return this.handleEnterkey(event)
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) return this.handleArrowUpDownKeys(event)
  }

  handleEnterkey = (event) => {
    const brands = get(this.state, 'filteredFormattedBrands', [])
    const idx = this.state.arrowKeyedToIndex
    const brand = get(brands, [idx], {})

    if (brand.isHeading) return

    this.props.push({
      pathname: brand.hrefPathname,
      query: { refresh: brand.orgId }
    })

    this.setState({ arrowKeyedToIndex: 0 })
  }

  handleArrowUpDownKeys = (event) => {
    const brands = get(this.state, 'filteredFormattedBrands', [])
    const idx = this.state.arrowKeyedToIndex

    let increment = (event.key === 'ArrowDown') ? 1 : -1

    const nextIndex = Math.min(
      Math.max(idx + increment, 0),
      brands.length - 1
    )
    this.setState({
      arrowKeyedToIndex: nextIndex,
      scrollTop: nextIndex
    })
  }

  render () {
    return (
      <div className={Styles.menu} onKeyDown={this.onKeyPress} >
        <div className={Styles.heading}>
          <SearchInput
            className={Styles.searchInput}
            ref={(input) => { this.searchInput = input }}
            inputProps={{
              placeholder: 'Find Brands'
            }}
            name='filter-brands'
            onChange={this.onQueryChange}
            isLive
          />
        </div>
        <BrandsMenuList
          arrowKeyedToIndex={this.state.arrowKeyedToIndex}
          brands={this.state.filteredFormattedBrands}
          query={this.state.curQuery}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
  push
}

BrandsMenu.propTypes = {
  brands: PropTypes.array.isRequired
}

BrandsMenu.defaultProps = {
  brands: []
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandsMenu)

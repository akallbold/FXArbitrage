import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { DownArrowIcon, TinySpinner } from 'playa-styleguide'
import { brandsForSwitcher } from 'selectors/org_selectors'
import { openBrandSwitcher, closeBrandSwitcher } from './brand_switcher_actions.js'
import BrandsMenu from './brands_menu'
import Styles from './brand_switcher.css'

export class BrandSwitcher extends React.Component {
  constructor (props) {
    super(props)
    this.id = this.props.id || 'brand-switcher'
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.isOpen && this.props.isOpen) {
      this.removeOutsideClickListener()
    } else if (nextProps.isOpen && !this.props.isOpen) {
      this.addOutsideClickListener()
    }
  }

  onClick = () => {
    if (this.props.isOpen) {
      this.props.closeBrandSwitcher()
    } else {
      this.props.openBrandSwitcher()
    }
  }

  outsideClickHandler = (event) => {
    if (document.getElementById(this.id).contains(event.target)) return false
    return this.props.closeBrandSwitcher()
  }

  addOutsideClickListener = () => window.addEventListener('click', this.outsideClickHandler)

  removeOutsideClickListener = () => window.removeEventListener('click', this.outsideClickHandler)

  render () {
    const { label, brands, isOpen } = this.props

    // get brand name from selected or first brand or null
    const brandName = get(brands.find(brand => brand.isSelected), 'name', brands[0] ? brands[0].name : null)
    const hasNoContent = !label && !brandName
    return (
      <div
        id='brand-switcher'
        className={`${Styles.switcher} ${isOpen ? 'is-open' : ''} ${hasNoContent ? 'no-content' : ''}`}
      >
        <span className={Styles.button}>
          <div className={Styles.secondaryText}>Brand</div>
          <div className={Styles.primaryText} onClick={this.onClick}>
            {!hasNoContent &&
              <span>{brandName || label} <DownArrowIcon className={Styles.downArrowIcon} /></span>
            }
            {hasNoContent &&
              <TinySpinner className={Styles.tinySpinner} />
            }
          </div>
        </span>
        {
          isOpen &&
          <BrandsMenu
            brands={brands}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  brands: brandsForSwitcher(state),
  isOpen: state.brandSwitcher.isOpen
})

const mapDispatchToProps = {
  openBrandSwitcher,
  closeBrandSwitcher
}

BrandSwitcher.propTypes = {
  // just plain old props
  label: PropTypes.string,
  // state props
  brands: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  // dispatch props
  openBrandSwitcher: PropTypes.func.isRequired,
  closeBrandSwitcher: PropTypes.func.isRequired
}

BrandSwitcher.defaultProps = {
  isOpen: true,
  brands: [],
  label: '',
  startDate: '',
  endDate: ''
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandSwitcher)

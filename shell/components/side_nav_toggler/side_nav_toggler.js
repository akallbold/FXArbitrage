import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { RightArrowIcon } from 'playa-styleguide'
import toggleSideNav from 'actions/side_nav_actions'
import Styles from './side_nav_toggler.css'

const SideNavToggler = ({ isOpen, onClick }) => (
  <div onClick={onClick} className={`${Styles.sideNavToggler} ${isOpen ? Styles.opened : ''}`}>
    <RightArrowIcon className={Styles.arrow} />
    <span className={Styles.label}>{isOpen ? 'Hide Menu' : 'Show Menu'}</span>
  </div>
)

SideNavToggler.propTypes = {
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  isOpen: state.sideNav.showSideNav
})

const mapDispatchToProps = {
  onClick: toggleSideNav
}

export default connect(mapStateToProps, mapDispatchToProps)(SideNavToggler)

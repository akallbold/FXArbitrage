import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { get } from 'lodash'
import {
  viewProfile,
  signOut,
  redirectToHelp,
  hideAccountMenu,
  showAccountMenu
} from 'actions/account_menu_actions'
import { getUser } from 'selectors/user_selectors'
import { isAccountMenuHidden } from 'selectors/account_menu_selectors'
import { Button, AccountIcon } from 'playa-styleguide'
import Styles from './account_menu.css'

export const AccountMenu = ({
  isHidden,
  user,
  ...restProps
}) => {
  const userAvatarURL = get(user, 'avatar.thumb_url', '')

  const onBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      restProps.hideAccountMenu()
    }
  }

  return (
    <div
      className={Styles.accountIconContainer}
      tabIndex='0'
      onBlur={onBlur}
    >
      <AccountIcon
        onClick={isHidden ? restProps.showAccountMenu : restProps.hideAccountMenu}
        className={Styles.accountIcon}
      />
      <div className={`${Styles.modal} ${isHidden ? Styles.isHidden : ''}`}>
        <div className={Styles.userDetails}>
          <img className={Styles.profileImg} src={userAvatarURL} alt='profile' />
          <p className={Styles.name}>{user.firstName} {user.lastName}</p>
          <p className={Styles.email}>{user.email}</p>
          <Button
            priority='secondary'
            size='fitToText'
            onClick={restProps.viewProfile}
          >View Profile
          </Button>
        </div>
        <div className={`${Styles.link} ${Styles.firstLinkMargin}`}>
          <Button
            priority='secondaryText'
            size='small'
            onClick={restProps.redirectToHelp}
          >Help
          </Button>
        </div>
        <div className={Styles.link}>
          <Button
            priority='secondaryText'
            size='small'
            onClick={restProps.signOut}
          >Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

AccountMenu.propTypes = {
  // mapStateToProps
  isHidden: PropTypes.bool,
  user: PropTypes.object,
  // mapDispatchToProps
  showAccountMenu: PropTypes.func,
  hideAccountMenu: PropTypes.func,
  viewProfile: PropTypes.func,
  redirectToHelp: PropTypes.func,
  signOut: PropTypes.func
}

AccountMenu.defaultProps = {
  isHidden: true,
  user: {},
  showAccountMenu: null,
  hideAccountMenu: null,
  viewProfile: null,
  redirectToHelp: null,
  signOut: null
}

const mapStateToProps = state => ({
  user: getUser(state) || {},
  isHidden: isAccountMenuHidden(state)
})

const mapDispatchToProps = {
  viewProfile,
  signOut,
  redirectToHelp,
  hideAccountMenu,
  showAccountMenu
}

const AccountMenuConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountMenu)

export default AccountMenuConnected

import {
  VIEW_PROFILE,
  SIGN_OUT,
  REDIRECT_TO_HELP,
  HIDE_ACCOUNT_MENU,
  SHOW_ACCOUNT_MENU
} from './constants.js'

export const viewProfile = () => ({
  type: VIEW_PROFILE
})

export const signOut = () => ({
  type: SIGN_OUT
})

export const redirectToHelp = () => ({
  type: REDIRECT_TO_HELP
})

export const hideAccountMenu = () => ({
  type: HIDE_ACCOUNT_MENU
})

export const showAccountMenu = () => ({
  type: SHOW_ACCOUNT_MENU
})

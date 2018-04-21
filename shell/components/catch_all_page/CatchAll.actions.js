export const SET_ERROR_PAGE = '@@CatchAll/SET_ERROR_PAGE'
export const UNSET_ERROR_PAGE = '@@CatchAll/UNSET_ERROR_PAGE'

export const setErrorPage = payload => ({ type: SET_ERROR_PAGE, payload })
export const unsetErrorPage = (payload = {}) => ({ type: UNSET_ERROR_PAGE, payload })

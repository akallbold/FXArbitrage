// NOTE: These constants and action creators need to also exist in your sub app.

export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODALS = 'CLOSE_MODALS'

export const openModal = id => ({ type: OPEN_MODAL, payload: { id } })
export const closeModals = () => ({ type: CLOSE_MODALS })

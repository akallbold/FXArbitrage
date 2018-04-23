export const CLEAR_ERROR = 'CLEAR_ERROR'
export const CLEAR_DATA = 'CLEAR_DATA'

export const clearError = ({ entity }) => ({
  type: CLEAR_ERROR,
  payload: { entity }
})

export const clearData = ({ entity }) => ({
  type: CLEAR_DATA,
  payload: { entity }
})

import { get, compact } from 'lodash'

/**
 * Create a selector to a piece of the pusherData state
 */
export const createPusherSelector = ({
  channel,
  name,
  action,
  propertyType,
  propertyId,
  opts = [] // path to deeper properties to select
}) => {
  let path = [channel, name, action, propertyType, propertyId]
  path = compact([...path, ...opts])

  return state => (get(state.pusherData, path))
}

export default createPusherSelector

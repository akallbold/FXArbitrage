/**
 * Formatter for action creator payload.
 * keeps state keys consistant in the store.
 *
 * usage example in action creator:
 *
 * import formatPayload from './payload_formatter'
 *
 * export const receivedBrands = brands => ({
 *   type: RECEIVED_BRANDS, payload: formatPayload({ data: brands })
 * })
 *
 */

const formatPayload = (params = {}) => {
  const { data = {}, error = {}, loading = false } = params
  return { data, error, loading }
}

export default formatPayload

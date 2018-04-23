import { get } from 'lodash'
import { oneLine } from 'common-tags'

/**
 * A utility to parse the `callType` string into it's parts: namespaced factory function path,
 * entity name, expected response key, and putType.
 * @param  {String} callType The `callType` defined as a constant in one of the api config files.
 * @return {Object}          Example --> `{ func: 'acl.getUser', responseKey: 'response',
 *                           entity: 'user', putType: 'as|merge', batch: 'batch' }`
 */
export const callTypeRegexp = /(\w+)\.(\S+)\s?(?:(from)\s(\S+)\s)?(as|merge)\s(\S+)\s?(batchauto|batch)?/
export const parseCallType = (callType) => {
  if (!callType) return null
  const parsedCallType = callType.match(callTypeRegexp)
  if (!parsedCallType) throw new Error(`callType '${callType}' does not follow the correct format.`)
  // eslint-disable-next-line no-unused-vars
  const [og, api, configFunc, from, responseKey, putType, entity, batch] = parsedCallType
  return { func: `${api}.${configFunc}`, responseKey, putType, entity, batch }
}

/**
 * Construct a callType from object properties. Basically the revers of `parseCallType`.
 * @param  {String} options.func        The method used to create the axios config.
 * @param  {String} options.responseKey Key on response object where data is expected to be.
 * @param  {String} options.entity      The target entity key for the response data.
 * @param  {String} options.putType     Tells reducers how to put the data into the entities slice.
 * @return {String}                     A string matching the `callType` convention.
 */
export const createCallType = ({
  func = '',
  responseKey = '',
  entity = '',
  putType = 'as',
  batch = '' }
) => {
  const callType = oneLine`
    ${func}
    ${responseKey ? `from ${responseKey}` : ''}
    ${putType}
    ${entity}
    ${batch ? batchWord : ''}`

  if (!func || !entity || !callType.match(callTypeRegexp)) {
    throw new Error(oneLine`Cannot create callType. Maybe required \`func\` or \`entity\` props
    are undefined. The callType '${callType}' does not follow the correct format.`)
  }
  return callType
}

/**
 * Looks up and invokes the config factory then returns the config. It takes the configs,
 * callType, and options for the config factory.
 * @param  {Object} configs   An object with name-spaced factory functions matching callType
 *                            definitions.
 * @param  {String} callType  The `callType` defined as a constant in one of the api config files.
 * @param  {Object} options   An object with properties that is passed to the factory function.
 * @return {Object}           The object returned from the factory function, with the extras
 *                            removed.
 */
export const getConfig = (configs, callType, options) => {
  const { func } = parseCallType(callType)
  const configFactory = get(configs, func)
  if (!configFactory || typeof configFactory !== 'function') throw new ReferenceError(`The ${callType} callType does not match an axios config factory in the api config or is not a function. Please make sure you have a factory function matching the one defined in the callType. The api configs can be found here in the shell '/client/shell/api/configs' or in sub apps in '/app/api/configs'.`)
  return configFactory({ ...options })
}

/**
 * Simply strips all props added to the payload by the fetch routines.
 * @return {Object}   payload  The current action payload.
 */
export const prepPayloadForApi = (payload) => {
  if (!payload) return null
  const { fetchRoutinePayload, ...apiPayload } = payload
  return apiPayload
}

/**
 * Simply strips all props from the config that are not desired for the api client. Using a utility
 * function for this since the list of irrelevant api props is likely to grow.
 * @return {Object}   payload  The current action payload.
 */
export const prepConfigForApi = (config) => {
  if (!config) return null
  const { merge, ...apiConfig } = config
  return apiConfig
}

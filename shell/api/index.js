/**
 * Exposes a function to pass callType and options for the api call and figure out which api config
 * to lookup the axios config. It's also used to pull all the api configs together and namespace
 * them accordingly.
 */
import axios from 'axios'
import { merge, get } from 'lodash'
import { getConfig, prepConfigForApi } from 'fetch_routine'
import configs from './configs'
import ServerError from './server-error'

// Create unique instance of axios for configurations
const doApi = axios.create({
  /* validateStatus: status => status >= 200 && status <= 500 */
})

/**
 * A factory for creating the interceptor function used for getting and setting the auth token.
 * @param  {object} axiosInstance The instance of axios we are using.
 * @return {function}             An Axios interceptor function.
 */

const mergeConfigHeaders = (config, headers) => {
  const configCopy = { ...config, headers: { ...config.headers, ...headers } }
  delete configCopy.authParams
  return configCopy
}

/**
 * A factory to create a token resolver interceptor.
 * @param  {object} axiosInstance The instance of axios we plan to add the interceptor to.
 * @return {function}             A function matching the axios interceptor signature.
 */
const authInterceptor = (axiosInstance) => {
  // used by interceptor created below to know if an attempt to get user token has been made before.
  let userTokenPromise = null
  // the interceptor
  return (config) => {
    // see if we already have a default auth header stop here somewhere to return config
    const authHeader = axiosInstance.defaults.headers.common.Authorization
    if (authHeader && !config.authParams) {
      return config
    } else if (authHeader && config.authParams) {
      const headers = { Authorization: `${authHeader}${config.authParams}` }
      return mergeConfigHeaders(config, headers)
    }

    // if no token, make attempt to fetch the token
    if (!userTokenPromise) {
      userTokenPromise = axios({ method: 'GET', url: '/usertoken' })
        .then(({ data: token }) => {
          // eslint-disable-next-line
          axiosInstance.defaults.headers.common.Authorization = `Token token=${token}`
        })
        .catch(error => Promise.reject(error))
    }

    // return a promise back to axios request which we'll resolve when the token arrives
    return new Promise((resolve) => {
      userTokenPromise.then(() => {
        const token = axiosInstance.defaults.headers.common.Authorization
        const headers = { Authorization: `${token}${config.authParams || ''}` }
        const newConfig = mergeConfigHeaders(config, headers)
        resolve(newConfig)
      })
    })
  }
}

// Add the interceptor
doApi.interceptors.request.use(authInterceptor(doApi).bind(doApi), error => Promise.reject(error))

/**
 * Copy and merge transformRequest and transformResponse functions with axios defaults and ensure
 * they are an array.
 * @param  {object} config An axios config object.
 * @return {object}        Copy of axios config with merge things.
 */
export const applyTransformResponse = (config) => {
  const transReq = typeof config.transformRequest === 'function'
    ? [config.transformRequest] : config.transformRequest || []
  const transResp = typeof config.transformResponse === 'function'
    ? [config.transformResponse] : config.transformResponse || []

  return merge({}, config, {
    transformResponse: [...axios.defaults.transformResponse, ...transResp],
    transformRequest: [...axios.defaults.transformRequest, ...transReq]
  })
}

/**
 * Plain Old API
 * doesn't use config factory but still has the interceptor.
 * For making api calls outside of the routine flow.
 */
const plainOldApi = axios.create()
plainOldApi.interceptors.request.use(
  authInterceptor(plainOldApi).bind(plainOldApi), error => Promise.reject(error)
)
export const poApi = config => plainOldApi(applyTransformResponse(config))

/**
 * This is what is used by the `fetch-sagas` to make the api call derived from the `callType` and
 * the options params the call needs.
 * @param  {string}    options.callType The `callType` defined as a constant in one of the api
 *                                      config files.
 * @param  {object}    options.options  The rest of the object params isolated from the `callType`
 *                                      using the spread/splat thing.
 * @return {promise}                    A promise that is returned from Axios.
 */
const api = ({ callType, ...options }) => {
  const config = prepConfigForApi(getConfig(configs, callType, options))
  return doApi(applyTransformResponse(config))
    .catch(error => {
      throw new ServerError({
        message: get(error, 'response.data.error_description') || error.message || 'API call failed.',
        status: get(error, 'response.status'),
        statusText: get(error, 'response.statusText'),
        method: get(error, 'response.config.method'),
        url: get(error, 'response.config.url'),
        params: get(error, 'response.config.params'),
        messages: get(error, 'response.data.messages'),
        ...error
      })
    })
}

export default api

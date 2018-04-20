import transformOrgs from 'api/transform-orgs'

const BASE = `${process.env.ACL_HOST}/api`
const HEADERS = {}

/**
 * API CONFIGS
 */

// Get user by id. Defaults to `me` which is current user.
export const ACL_GET_USER = 'acl.getUser as aclUser'
export const getUser = ({ id = 'me' }) => ({
  method: 'GET',
  url: `${BASE}/v2/users/${id}`,
  headers: {
    ...HEADERS
  }
})

// Get all the orgs.
export const ACL_GET_ORGS = 'acl.getOrgs as aclOrgs'
export const getOrgs = () => ({
  method: 'GET',
  url: `${BASE}/v3/users/organizations`,
  headers: {
    ...HEADERS
  },
  transformResponse: transformOrgs
})

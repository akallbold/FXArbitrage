import transformOrgs from 'api/transform-orgs'

const BASE = `${process.env.SHELL_HOST}/api`
const HEADERS = {}

/**
 * API CONFIGS
 */

// Get user by id. Defaults to `me` which is current user.
export const SHELL_GET_USER = 'acl.getUser as aclUser'
export const getUser = ({ id = 'me' }) => ({
  method: 'GET',
  url: `${BASE}/v1/users/${id}`,
  headers: {
    ...HEADERS
  }
})

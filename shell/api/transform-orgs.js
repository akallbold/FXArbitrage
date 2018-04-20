import { get } from 'lodash'
import { normalize, schema } from 'normalizr'

const brandsSchema = new schema.Entity('brands')
const brands = [brandsSchema]

const companySchema = new schema.Entity('companies', { brands })
const companies = [companySchema]

const groupSchema = new schema.Entity('groups', { companies })
// shorthand for `new schema.Array(groupSchema)`
export const groups = [groupSchema]

export default (data) => {
  const response = normalize(get(data, 'response', []), groups)
  return { response }
}

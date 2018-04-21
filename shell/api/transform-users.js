import { get } from 'lodash'
import { normalize, schema } from 'normalizr'

const usersSchema = new schema.Entity('users')
const users = [usersSchema]

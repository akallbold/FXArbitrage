import { createSelector } from 'reselect'
import { isEmpty, get } from 'lodash'


export const getCurrentUserSelector = state => get(state, 'entities.users.data')

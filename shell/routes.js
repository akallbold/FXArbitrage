import { subAppRoutes } from 'sub_apps'

export const BASE_NAME = '/pv'
export const HOME = '/'
export const BRANDS = '/brands/:brandId(/*)'

const title = ' HYFN8 - Do Social Better'

const routes = {
  [HOME]: {
    id: 'home',
    title,
    description: 'This is the HYFN8 homepage.'
  },
  ...subAppRoutes.snapChat,
  ...subAppRoutes.twitter,
  ...subAppRoutes.facebook,
  ...subAppRoutes.pinterest
}

export default routes

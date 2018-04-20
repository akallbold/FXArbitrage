import { middleware as catchall } from 'components/catch_all_page'
import sentryMiddleware from './sentry_middleware'
import pageViewAnalytics from './page_view_analytics'
import closeMenus from './close_menus'
import clearEntitiesData from './clear_store_key'
import { globalLoaderMiddleware } from 'global-loader'
import { generatePusherFid } from 'pusher_service'

export default [clearEntitiesData, globalLoaderMiddleware, pageViewAnalytics, closeMenus, catchall, sentryMiddleware, generatePusherFid]

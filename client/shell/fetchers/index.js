/**
 * Configure fetcher actions, you shouldn't need to mess with this.
 * Fetchers support creating a separte fetcher action other than the Fetch Routines we use
 * for api calls.
 *
 * This config handles all fetchers from subapps as well.
 */
import { addFetcherAction } from 'redux-saga-route-fetcher'
import { fetchRoutine } from 'client/shell/fetch_routine'

/**
 * Import fetcher configs here.
 */

addFetcherAction(fetchRoutine.trigger)

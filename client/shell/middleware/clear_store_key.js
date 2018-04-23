import { get, isFunction } from 'lodash'
import { CLEAR_DATA } from '../fetch_routine/fetch-actions'

const CLEAR_PUSHER_DATA = 'CLEAR_PUSHER_DATA'
const clearPusherData = path => ({ type: CLEAR_PUSHER_DATA, payload: path })

const callTypesToClear = [
  'fb.getCampaigns as fbCampaigns',
  'fb.getAdsets as fbAdsets',
  'fb.getAds as fbAds',
  'sc.getAdSets as scAdsets',
  'sc.getCampaigns as scCampaigns',
  'sc.getAds as scAds',
  'tw.getAdSets as twAdsets',
  'tw.getCampaigns as twCampaigns',
  'tw.getAds as twAds',
  'pt.getAdSets as ptAdSets',
  'pt.getCampaigns as ptCampaigns',
  'pt.getAds as ptAds'
]

const clearPusherKeysforCalltypes = {
  'fb.getMetrics as fbMetrics': action => `facebook.campaignManager.${get(action, 'payload.pusherAction')}.brand._${get(action, 'payload.brandId')}`,
  'fb.getCampaigns as fbCampaigns': action => `facebook.campaignManager.getCampaignsMetrics.brand._${get(action, 'payload.params.brandId')}`,
  'fb.getAdsets as fbAdsets': action => `facebook.campaignManager.getAdsetsMetrics.brand._${get(action, 'payload.params.brandId')}`,
  'sc.getAdSets as scAdsets': action => `snapchat.snapchatCampaignManager.getAdsetsMetrics.brand._${get(action, 'payload.params.brandId')}`,
  'sc.getCampaigns as scCampaigns': action => `snapchat.snapchatCampaignManager.getCampaignsMetrics.brand._${get(action, 'payload.params.brandId')}`,
  'sc.getAds as scAds': action => `snapchat.snapchatCampaignManager.getAdsMetrics.brand._${get(action, 'payload.params.brandId')}`,
  'tw.getAdSets as twAdsets': action => `twitter.twitterDeliveryReport.getAdsetsMetrics.brand_${get(action, 'payload.params.brandId')}`,
  'tw.getCampaigns as twCampaigns': action => `twitter.twitterDeliveryReport.getCampaignsMetrics.brand._${get(action, 'payload.params.brandId')}`,
  'tw.getAds as twAds': action => `twitter.twitterDeliveryReport.getAdsMetrics.brand._${get(action, 'payload.params.brandId')}`,
  'pt.getCampaigns as ptCampaigns': action => `pinterest.pinterestDeliveryReport.getCampaignsMetrics.brand._${get(action, 'payload.params.brandId')}`,
  'pt.getAdSets as ptAdSets': action => `pinterest.pinterestDeliveryReport.getAdsetsMetrics.brand._${get(action, 'payload.params.brandId')}`,
  'pt.getAds as ptAds': action => `pinterest.pinterestDeliveryReport.getAdsMetrics.brand._${get(action, 'payload.params.brandId')}`
}

const clearEntitiesData = store => next => (action) => {
  if (action.type === 'FETCH_TRIGGER' && callTypesToClear.includes(get(action, 'payload.callType'))) {
    const callTypeArray = action.payload.callType.split(' ')
    const entity = callTypeArray[callTypeArray.length - 1]
    store.dispatch({ type: CLEAR_DATA, payload: { entity } })
  }

  const getPusherPath = clearPusherKeysforCalltypes[get(action, 'payload.callType')]
  if (action.type === 'FETCH_TRIGGER' && isFunction(getPusherPath)) {
    const pusherPath = getPusherPath(action)
    store.dispatch(clearPusherData(pusherPath))
  }

  next(action)
}

export default clearEntitiesData

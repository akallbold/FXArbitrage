import React from 'react'
import { connect } from 'react-redux'
import { get, toString } from 'lodash'
import { static as Immutable } from 'seamless-immutable'
import { PropTypes } from 'prop-types'
import { querySelector } from 'hyfn8-frontend-cocktail'
import { fetchRoutine } from 'fetch_routine'
import { curBrandSelector, curChannelSelector } from 'selectors/platform_selectors'
import { currentBrand } from 'selectors/org_selectors'
import {
  parentSelector,
  parentDataSelector,
  adsetNameSelector,
  campaignNameSelector,
  breadCrumbDepthSelector,
  BRAND,
  CAMPAIGN,
  AD_SET,
  LOADING_NAME
} from 'selectors/bread_crumb_selectors'
import BreadCrumbLink from './bread_crumb_link'
import Styles from './bread_crumb.css'

// In the future we should import these callTypes
// from the sub apps instead of hardcoding them.
const CHANNEL_CAMPAIGN_CALLTYPE = {
  snapchat: 'sc.getParentCampaign as scParentCampaign',
  pinterest: 'pt.getParentCampaign as ptParentCampaign',
  twitter: 'tw.getParentCampaign as twParentCampaign',
  facebook: 'fb.getParentCampaign as fbParentCampaign'
}
const CHANNEL_AD_SET_CALLTYPE = {
  snapchat: 'sc.getParentAdset as scParentAdset',
  pinterest: 'pt.getParentAdset as ptParentAdset',
  twitter: 'tw.getParentAdset as twParentAdset',
  facebook: 'fb.getParentAdset as fbParentAdset'
}

export const shouldFetchParent = ({
  isLoading,
  desiredParentId,
  currentParentId
}) => {
  if (
    // if it's loading, no fetch
    !!isLoading ||
    // if there is no id to fetch, no fetch
    !desiredParentId ||
    // if the curernt parent id (currently in the store)
    // is the same as the desired one, no fetch
    (toString(currentParentId) === toString(desiredParentId))
  ) return false
  // otherwise, fetch
  return true
}

export class BreadCrumb extends React.Component {
  // Each subapp will actually fetch the direct parent IF a single parent is selected.
  // Nontheless we want the breadCrumb component to be an INDEPENDENT unit and NOT depend
  // on the subapps for any data fetching.
  // Therefore we must manage data fetching here as well.
  // For in depth explanations of the breadcrumb fetching logic see:
  // https://github.com/hyfn/hyfn8_front_end_app/wiki/BreaCrumb-Logic
  componentWillReceiveProps (nextProps) {
    switch (nextProps.breadCrumbDepth) {
      case CAMPAIGN:
        this.handleCampaign({ nextProps })
        break
      case AD_SET:
        this.handleAdset({ nextProps })
        this.handleAdsetCampaign({ nextProps })
        break
      default:
        break
    }
  }

  handleCampaign = ({ nextProps }) => {
    const {
      brandId,
      query,
      channel,
      parentCampaign,
      parentCampaignData
    } = nextProps

    const isLoading = get(parentCampaign, 'loading')
    const currentParentId = get(parentCampaignData, 'id')
    const desiredParentId = query.campaigns
    if (shouldFetchParent({ isLoading, desiredParentId, currentParentId })) {
      this.fetchParentCampaign({ query, channel, brandId })
    }
  }

  handleAdset = ({ nextProps }) => {
    const {
      brandId,
      query,
      channel,
      parentAdset,
      parentAdsetData
    } = nextProps

    const isLoading = get(parentAdset, 'loading')
    const currentParentId = get(parentAdsetData, 'id')
    const desiredParentId = query.adsets
    if (shouldFetchParent({ isLoading, desiredParentId, currentParentId })) {
      this.fetchParentAdset({ query, channel, brandId })
    }
  }

  handleAdsetCampaign = ({ nextProps }) => {
    const {
      query,
      parentAdsetData,
      parentCampaignData
    } = nextProps

    // first check if the ad set in the store is the correct one
    const adsetId = get(parentAdsetData, 'id')
    if (adsetId && toString(adsetId) === toString(query.adsets)) {
      const desiredCampgaignId = get(parentAdsetData, 'campaignId') || get(parentAdsetData, 'campaignGroupId') // comes from the adset in the store
      const currentCampaignId = get(parentCampaignData, 'id') // comes from the store
      // If the store already has campaign data with id that matches the
      // desiredCampgaignId then we need not make an additional fetch.
      if (desiredCampgaignId && toString(desiredCampgaignId) !== toString(currentCampaignId)) {
        // https://github.com/hyfn/hyfn8_front_end_app/wiki/BreaCrumb-Logic
        const customQuery = Immutable.merge(query, { campaigns: toString(desiredCampgaignId) })
        const customNextProps = Immutable.merge(nextProps, { query: customQuery })
        this.handleCampaign({ nextProps: customNextProps })
      }
    }
  }

  fetchParentCampaign = ({ query, channel, brandId }) =>
    this.props.fetchTrigger(
      {
        callType: CHANNEL_CAMPAIGN_CALLTYPE[channel],
        params: { brandId },
        query
      }
    )

  fetchParentAdset = ({ query, channel, brandId }) =>
    this.props.fetchTrigger(
      {
        callType: CHANNEL_AD_SET_CALLTYPE[channel],
        params: { brandId },
        query
      }
    )

  render () {
    const {
      query,
      channel,
      brand,
      brandId,
      breadCrumbDepth,
      campaignName,
      adsetName
    } = this.props

    return (
      <div className={Styles.wrapper}>
        <BreadCrumbLink
          brandId={brandId}
          channel={channel}
          name={get(brand, 'name') || LOADING_NAME}
          childrenLevel='campaigns'
          key={`brand_${brandId}`}
        />

        { (breadCrumbDepth === CAMPAIGN || breadCrumbDepth === AD_SET) &&
          <BreadCrumbLink
            brandId={brandId}
            channel={channel}
            name={campaignName}
            childrenLevel='adsets'
            key={`campaign_${query.campaigns}`}
          />
        }

        { breadCrumbDepth === AD_SET &&
          <BreadCrumbLink
            brandId={brandId}
            channel={channel}
            name={adsetName}
            childrenLevel='ads'
            key={`adset_${query.adsets}`}
          />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  fetchTrigger: fetchRoutine.trigger
}

const mapStateToProps = state => ({
  brandId: curBrandSelector(state),
  brand: currentBrand(state),
  query: querySelector(state),
  channel: curChannelSelector(state),
  parentAdset: parentSelector(state, 'adsets'),
  parentAdsetData: parentDataSelector(state, 'adsets'),
  parentCampaign: parentSelector(state, 'campaigns'),
  parentCampaignData: parentDataSelector(state, 'campaigns'),
  breadCrumbDepth: breadCrumbDepthSelector(state),
  adsetName: adsetNameSelector(state),
  campaignName: campaignNameSelector(state)
})

BreadCrumb.propTypes = {
  brand: PropTypes.object,
  brandId: PropTypes.string,
  query: PropTypes.object,
  channel: PropTypes.string,
  parentAdset: PropTypes.object,
  parentAdsetData: PropTypes.object,
  parentCampaign: PropTypes.object,
  parentCampaignData: PropTypes.object,
  breadCrumbDepth: PropTypes.string,
  adsetName: PropTypes.string,
  campaignName: PropTypes.string
}

BreadCrumb.defaultProps = {
  brand: null,
  brandId: null,
  parentAdset: null,
  parentAdsetData: null,
  parentCampaign: null,
  parentCampaignData: null,
  breadCrumbDepth: BRAND,
  adsetName: LOADING_NAME,
  campaignName: LOADING_NAME
}

export default connect(mapStateToProps, mapDispatchToProps)(BreadCrumb)

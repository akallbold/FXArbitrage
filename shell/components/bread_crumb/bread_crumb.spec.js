import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { BreadCrumb, shouldFetchParent } from './bread_crumb'

describe('<BreadCrumb />', () => {
  const brandId = '5'
  const brand = { id: brandId, name: 'My Brand' }
  const channel = 'facebook'

  const campaignName = 'Campaign 1'
  const parentCampaignData = {
    id: 1,
    name: campaignName
  }

  const adsetName = 'Adset 4'
  const parentAdsetData = {
    id: 4,
    name: adsetName,
    campaignId: 1
  }

  const parentAdset = {
    data: parentAdsetData,
    loading: false
  }

  const parentCampaign = {
    data: parentAdsetData,
    loading: false
  }

  describe('Only brand BreadCrumb shows', () => {
    const query = {
      campaigns: '1,2,3'
    }
    const breadCrumbDepth = 'BRAND'

    it('renders', () => {
      const wrapper = shallow(<BreadCrumb
        brand={brand}
        brandId={brandId}
        query={query}
        channel={channel}
        breadCrumbDepth={breadCrumbDepth}
      />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })

  describe('Brand and campaign BreadCrumbs shows', () => {
    const query = {
      campaigns: '1'
    }
    const breadCrumbDepth = 'CAMPAIGN'

    it('renders', () => {
      const wrapper = shallow(<BreadCrumb
        brand={brand}
        brandId={brandId}
        query={query}
        channel={channel}
        breadCrumbDepth={breadCrumbDepth}
        parentCampaign={parentCampaign}
        parentCampaignData={parentCampaignData}
        campaignName={campaignName}
      />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
  })

  describe('Brand, campaign, and adset BreadCrumbs shows', () => {
    describe('When parentAdset has campaignId', () => {
      const query = {
        campaigns: '1',
        adsets: '3'
      }
      const breadCrumbDepth = 'AD_SET'

      it('renders', () => {
        const wrapper = shallow(<BreadCrumb
          brand={brand}
          brandId={brandId}
          query={query}
          channel={channel}
          breadCrumbDepth={breadCrumbDepth}
          parentCampaign={parentCampaign}
          parentCampaignData={parentCampaignData}
          campaignName={campaignName}
          parentAdset={parentAdset}
          parentAdsetData={parentAdsetData}
          adsetName={adsetName}
        />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })

    describe('When parentAdset has campaignGroupId (for FB)', () => {
      const parentAdsetData = {
        id: 4,
        name: adsetName,
        campaignGroupId: 1
      }

      const parentAdset = {
        data: parentAdsetData,
        loading: false
      }

      const query = {
        campaigns: '1',
        adsets: '3'
      }
      const breadCrumbDepth = 'AD_SET'

      it('renders', () => {
        const wrapper = shallow(<BreadCrumb
          brand={brand}
          brandId={brandId}
          query={query}
          channel={channel}
          breadCrumbDepth={breadCrumbDepth}
          parentCampaign={parentCampaign}
          parentCampaignData={parentCampaignData}
          campaignName={campaignName}
          parentAdset={parentAdset}
          parentAdsetData={parentAdsetData}
          adsetName={adsetName}
        />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })
  })
})

describe('shouldFetchParent', () => {
  describe('parent is missing', () => {
    const isLoading = null
    const currentParentId = null
    const desiredParentId = '5'

    it('should return true', () => {
      expect(
        shouldFetchParent({ isLoading, desiredParentId, currentParentId })
      ).toEqual(true)
    })
  })

  describe('parent is present', () => {
    describe('loading is true', () => {
      const isLoading = true
      const desiredParentId = '5'
      const currentParentId = 3

      it('should return false', () => {
        expect(
          shouldFetchParent({ isLoading, desiredParentId, currentParentId })
        ).toEqual(false)
      })
    })

    describe('loading is false', () => {
      const isLoading = false

      describe('desiredParentId is falsey', () => {
        const desiredParentId = ''
        const currentParentId = 5

        it('should return false', () => {
          expect(
            shouldFetchParent({ isLoading, desiredParentId, currentParentId })
          ).toEqual(false)
        })
      })

      describe('desiredParentId id is truthy', () => {
        const desiredParentId = '5'

        describe('parentData id does not match desiredParentId', () => {
          const currentParentId = 3

          it('should return true', () => {
            expect(
              shouldFetchParent({ isLoading, desiredParentId, currentParentId })
            ).toEqual(true)
          })
        })

        describe('parentData id does match desiredParentId', () => {
          const currentParentId = 5

          it('should return false', () => {
            expect(
              shouldFetchParent({ isLoading, desiredParentId, currentParentId })
            ).toEqual(false)
          })
        })
      })
    })
  })
})

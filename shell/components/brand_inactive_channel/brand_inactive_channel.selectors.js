import { createSelector } from 'reselect'
import { brandChannels } from 'selectors/org_selectors'
import { curChannelSelector } from 'selectors/platform_selectors'

const brandHasChannelSelector = createSelector(
  brandChannels,
  curChannelSelector,
  (channels, curChannel) => (channels[curChannel])
)

export default brandHasChannelSelector

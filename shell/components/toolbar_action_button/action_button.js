import React from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { DropdownButton, Button } from 'playa-styleguide'
import { push } from 'redux-little-router'
import { curChannelUrlSelector, curChannelSelector } from 'selectors/platform_selectors'

const dropdownOptions = [{ name: 'Bulk Upload', id: 'bulkUpload' }]

export const ActionButtonComponent = ({ channelUrl, channel, pushRoute }) => {
  const onButtonClick = () => (
    pushRoute(`${channelUrl}/manager/campaigns/new`)
  )

  const onOptionClick = (e) => {
    if (get(e, 'target.value') !== 'bulkUpload') return
    pushRoute(`${channelUrl}/bulk-upload`)
  }

  if (channel === 'twitter') {
    return (
      <Button
        onClick={onButtonClick}
        size='large'
      >
        Create Campaign
      </Button>
    )
  }

  return (
    <DropdownButton
      onClick={onButtonClick}
      onOptionClick={onOptionClick}
      listData={dropdownOptions}
      listType='standardDropdown'
      lockBody
    >
      Create Campaign
    </DropdownButton>
  )
}

const mapDispatchToProps = { pushRoute: push }

const mapStateToProps = state => ({
  channelUrl: curChannelUrlSelector(state),
  channel: curChannelSelector(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(ActionButtonComponent)

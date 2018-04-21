import Pusher, { setPusherClient } from 'react-pusher'
import pusherClient from 'pusher-js'
import React from 'react'
import Raven from 'raven-js'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { getUserId } from 'selectors/user_selectors'
import { pusherNewNotificationReceived } from './pusher_actions'
import { EVENT_NEW_NOTIFICATION, PUSHER_CONNECTION_ESTABLISHED } from './constants'
import { isLatestFid } from './pusher_fids_cache'

/* eslint-disable new-cap */
const client = new pusherClient(process.env.PUSHER_KEY)
setPusherClient(client)

export const getFidAndPusherAction = data => {
  try {
    const notifiableParams = get(data, 'params')
    const { fid, action } = typeof notifiableParams === 'string' ? JSON.parse(notifiableParams || '{}') : notifiableParams || {}
    const pusherAction = action || get(data, 'section.action') || get(data, 'payload.action') || undefined
    return {
      fid,
      pusherAction
    }
  } catch (error) {
    Raven.captureException(new Error('Problem finding or parsing fid and pusher action from pusher update data: ', error))
    return {}
  }
}

const PusherListener = ({
  userId,
  dispatch,
  eventKey = EVENT_NEW_NOTIFICATION
}) => {
  client.connection.bind('connected', () => dispatch({
    type: PUSHER_CONNECTION_ESTABLISHED
  }))

  if (!userId) return null

  return (
    <Pusher
      channel={`hyfn8_channel_${userId}`}
      event={eventKey}
      onUpdate={data => {
        const { fid, pusherAction } = getFidAndPusherAction(data)
        if (fid && pusherAction && !isLatestFid({ pusherAction, fid })) return
        dispatch(pusherNewNotificationReceived(data, eventKey))
      }}
    />
  )
}

const mapStateToProps = state => ({
  userId: getUserId(state)
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(PusherListener)

import React from 'react'
import { connect } from 'react-redux'

import {
  curBrandSelector,
  curChannelSelector,
  curSectionSelector
} from 'selectors/platform_selectors'

import LibraryMenuItem from './library_menu_item'
import MENU_LIBRARY_CONTENT from './library_menu_constants'
import Styles from './library.css'

export class Library extends React.PureComponent {
  constructor (props) {
    super(props)
    this.id = this.props.id || 'menu-library'
  }

  render () {
    const { currentBrandId, curLevelName, selectedChannel } = this.props
    if (selectedChannel === 'twitter') {
      return null
    }

    return (
      <div>
        <div>
          <div className={Styles.libraries}>Library</div>
        </div>

        {MENU_LIBRARY_CONTENT[selectedChannel].map(libraryItem => (
          <div key={libraryItem.name}>
            <LibraryMenuItem
              {...libraryItem}
              selectedChannel={selectedChannel}
              currentBrandId={currentBrandId}
              isOpen={curLevelName === libraryItem.urlId}
            />
          </div>
        ))}
      </div>
    )
  }
}

Library.defaultProps = {
  hoveredMenuId: null,
  selectedChannel: 'facebook'
}

const mapStateToProps = state => ({
  currentBrandId: curBrandSelector(state),
  curLevelName: curSectionSelector(state),
  selectedChannel: (curChannelSelector(state) || 'facebook')
})

export default connect(mapStateToProps)(Library)

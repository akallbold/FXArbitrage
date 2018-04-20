import React from 'react'
import { Link } from 'redux-little-router'

import Styles from './library_menu_sub_item.css'

export const LibraryMenuSubItem = ({
  selectedChannel,
  currentBrandId,
  libraryItemUrlId,
  name,
  urlId
}) => {
  const subLibraryClass = `${Styles.item}`
  const subLibraryContentClassSelected = { className: `${Styles.contentLink} ${Styles.contentSelectedLink}` }
  const subLibraryContentClassInactive = `${Styles.contentLink} ${Styles.contentInactiveLink}`

  const url = `/brands/${currentBrandId}/${selectedChannel}/${libraryItemUrlId}/${urlId}`

  return (
    <div className={subLibraryClass}>
      <div>
        <Link
          className={subLibraryContentClassInactive}
          href={url}
          activeProps={subLibraryContentClassSelected}
        >
          {name}
        </Link>
      </div>
    </div>
  )
}

export default LibraryMenuSubItem

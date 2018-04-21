import React from 'react'

import {
  AssetsIcon,
  TargetingIcon,
  AdPixelsIcon,
  MetricsIcon,
  StudiesIcon
} from 'playa-styleguide'

import LibraryMenuSubItem from './library_menu_sub_item'
import Styles from './library_menu_item.css'

const renderIcon = (libraryName) => {
  switch (libraryName) {
    case 'assets':
      return <AssetsIcon />
    case 'audiences':
      return <TargetingIcon />
    case 'studies':
      return <StudiesIcon />
    case 'metrics':
      return <MetricsIcon />
    case 'pixels':
    case 'conversion tags':
      return <AdPixelsIcon />
    default:
      return null
  }
}
// ${Styles.hide}
export const LibraryMenuItem = ({
  name,
  urlId,
  subMenu,
  selectedChannel,
  currentBrandId,
  isOpen
}) => (
  <div className={Styles.itemWrapper}>
    <div className={Styles.item}>
      <div className={Styles.content}>
        <div className={Styles.icon}>{renderIcon(name)}</div>
        <div className={Styles.name}>{name}</div>
      </div>
    </div>
    <div
      className={isOpen ? `${Styles.subItems} ${Styles.isOpen}` : `${Styles.subItems}`}
    >
      {subMenu.map(librarySubItem => (
        <LibraryMenuSubItem
          selectedChannel={selectedChannel}
          currentBrandId={currentBrandId}
          libraryItemUrlId={urlId}
          {...librarySubItem}
          key={librarySubItem.name}
        />
      ))}
    </div>
  </div>
)

export default LibraryMenuItem

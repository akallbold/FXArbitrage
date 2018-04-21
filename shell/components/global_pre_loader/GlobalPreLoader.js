import React from 'react'
import { get } from 'lodash'
import { StatusSpinner } from 'playa-styleguide'
import { createGlobalLoader } from 'global-loader'

import * as styles from './GlobalPreLoader.css'

export const GlobalPreLoader = ({ loader }) => (
  <div className={styles.container}>
    <div className={styles.inner}>
      <StatusSpinner status='IN_PROGRESS' />
      <span className={styles.message}>{get(loader.options, 'message', '')}</span>
    </div>
  </div>
)

export default createGlobalLoader({ OnComponent: GlobalPreLoader, loaderIds: ['SHELL_GLOBAL_LOADER'] })

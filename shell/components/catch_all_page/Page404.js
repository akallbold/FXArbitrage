import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'
import { Button } from 'playa-styleguide'
import Robot404 from './Robot404'
import Styles from './ErrorPage.css'

const Page404 = ({ prevPathname }) => (
  <div className={Styles.errorPage}>
    <Robot404 className={Styles.image} />
    <div className={Styles.message}>This is not the page you’re looking for...</div>
    {prevPathname &&
      <Button
        className={Styles.button}
        href={prevPathname}
        component={Link}
        priority='primary'
        size='large'
      >
        Take me back
      </Button>
    }
    {!prevPathname &&
      <div className={Styles.message}>
        Please use the brands menu at the top of the page to continue.
      </div>
    }
  </div>
)

Page404.propTypes = {
  prevPathname: PropTypes.string
}

Page404.defaultProps = {
  prevPathname: null
}

export default Page404

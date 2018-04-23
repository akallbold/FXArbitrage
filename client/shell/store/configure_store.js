/* eslint-disable global-require */
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./config_store_prod')
} else {
  module.exports = require('./config_store_dev')
}

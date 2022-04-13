const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  GOOGLE_API_KEY: '"AIzaSyAuX0eP9CBzbkfqrVtCC0gPL4BiUm_EUUo"'
})

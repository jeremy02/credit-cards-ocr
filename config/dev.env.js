const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  GOOGLE_API_KEY: '"AIzaSyCCX-1uqpeOccH5TkJEj2pkOBU6phtS9RM"'
})

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./config.prod');
} else {
  module.exports = require('./config.dev');
}

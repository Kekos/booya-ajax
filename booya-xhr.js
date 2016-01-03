var xhr = require('xhr');

module.exports = function (options, callback) {
  if (typeof options.headers === 'undefined') {
    options.headers = {};
  }

  options.headers['X-Requested-With'] = 'XMLHttpRequest';

  xhr(options, callback);
};
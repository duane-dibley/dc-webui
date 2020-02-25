/* global module */

module.exports = function (config, resource) {
  return config.protocol + '://' + config.uri +
    (config.port ? ':' + config.port : '') +
    (resource.charAt(0) === '/' ? resource : '/' + resource);
};

// Same as @apiUse
var apiParser = require('./apiuse.js');

/**
 * Exports
 */
module.exports = {
    parse        : apiParser.parse,
    path         : 'local.permission',
    method       : apiParser.method,
    preventGlobal: true
};

// Same as @apiExample
var apiParser = require('./apiexample.js');

/**
 * Exports
 */
module.exports = {
    parse : apiParser.parse,
    path  : 'local.header.examples',
    method: apiParser.method
};

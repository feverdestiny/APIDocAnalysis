// Same as @apiExample
var apiParser = require('./apiexample.js');

/**
 * Exports
 */
module.exports = {
    parse : apiParser.parse,
    path  : 'local.parameter.examples',
    method: apiParser.method
};

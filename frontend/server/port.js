/* 
 * This file is required for the app to run properly
 */

const argv = require('./argv');

module.exports = parseInt(argv.port || process.env.PORT || '3000', 10);

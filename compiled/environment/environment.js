'use strict';

var environment = require('./environment.json');
var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    var envConfig = environment[env];
    Object.keys(envConfig).forEach(function (key) {
        process.env[key] = envConfig[key];
    });
} else {
    var envConfig = environment.prod;
    Object.keys(envConfig).forEach(function (key) {
        process.env[key] = envConfig[key];
    });
}
//# sourceMappingURL=environment.js.map
'use strict';

var mongoose = require("mongoose");
require('./../environment/environment');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
});
var db = mongoose.connection;
db.on('error', function (res) {
    console.error('connection error', res);
});
db.once('open', function () {
    console.error('mongo connection successfull');
});

module.exports = {
    mongoose: mongoose
};
//# sourceMappingURL=mongoose.js.map
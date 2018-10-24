"use strict";

require("./environment/environment");

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require("body-parser");

var _mongoose = require("./db/mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require("./app/modules/user/routes/user.routes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT;

var app = (0, _express2.default)();
app.use((0, _bodyParser.json)());
app.use((0, _cors2.default)());

app.use('/', _user.router);

app.listen(port, function () {
    console.log("Server started at " + port);
});
//# sourceMappingURL=server.js.map
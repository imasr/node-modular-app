"use strict";

var mongoose = require("mongoose");

var ErrorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

var Error = mongoose.model("Error", ErrorSchema);

module.exports = {
  Error: Error
};
//# sourceMappingURL=error.model.js.map
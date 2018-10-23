const mongoose = require("mongoose");

const ErrorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

var Error = mongoose.model("Error", ErrorSchema);

module.exports = {
  Error
};

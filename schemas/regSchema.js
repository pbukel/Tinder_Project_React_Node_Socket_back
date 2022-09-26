const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const regModel = new Schema({
  userName: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  img: {
    type: Array,
    required: false,
    default: [
      "https://www.seekpng.com/png/detail/428-4287240_no-avatar-user-circle-icon-png.png",
    ],
  },
  myLikes: {
    type: Array,
    required: false,
    default: [],
  },
  whoLikesme: {
    type: Array,
    required: false,
    default: [],
  },
  myDislikes: {
    type: Array,
    required: false,
    default: [],
  },
  whoDislikesMe: {
    type: Array,
    required: false,
    default: [],
  },
});

module.exports = mongoose.model("Registration", regModel);

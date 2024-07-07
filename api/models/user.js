const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  password: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
});

const UserModel = model('User', userSchema);

module.exports = UserModel;

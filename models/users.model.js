const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email : String,
    first_name: String,
    last_name: String
},{collection: 'users'});

module.exports = mongoose.model('UserModel', userSchema);
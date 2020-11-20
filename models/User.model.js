const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email : { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
},{collection: 'users'});

module.exports = mongoose.model('UserModel', userSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
	id: { type: Number, required: true, unique: true },
	fname: String,
	lname: String,
	email: String
});

const user = mongoose.model('User', userSchema);
module.exports = user;

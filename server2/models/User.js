const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	email  : { type: String, require: true },
	fname  : { type: String, require: true },
	lname  : { type: String, require: true },
	userid : { type: String, require: true, unique: true }
});

module.exports = mongoose.model('user', UserSchema);

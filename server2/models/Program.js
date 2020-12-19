const mongoose = require('mongoose');

const ProgramSchema = mongoose.Schema({
	programName : { type: String, require: true },
	uid         : { type: String, require: true },
	workouts    : { type: [] }
});

module.exports = mongoose.model('Program', ProgramSchema);

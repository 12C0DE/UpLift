const mongoose = require('mongoose');

const WorkoutSchema = mongoose.Schema({
	workoutName : { type: String, require: true },
	workoutDesc : String,
	lifts       : { type: [] },
	uid         : String
});

module.exports = mongoose.model('workout', WorkoutSchema);

const mongoose = require('mongoose');

const MuscleSchema = mongoose.Schema({
	name     : String,
	is_front : Boolean,
	muscleId : Number
});

module.exports = mongoose.model('muscle', MuscleSchema);

const mongoose = require('mongoose');

const LiftSchema = mongoose.Schema({
	liftName  : { type: String, required: true },
	liftDesc  : String,
	muscPrim  : [],
	muscSec   : [],
	equipment : []
});

module.exports = mongoose.model('lift', LiftSchema);

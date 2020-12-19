const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

//get all WOs
router.get('/', async (req, res) => {
	try {
		const WOs = await Workout.find();
		res.json(WOs);
	} catch (err) {
		res.json({ message: err });
	}
});

//get specifc WO
router.get('/:_id', async (req, res) => {
	try {
		const oneWO = await Workout.findById(req.params._id);
		res.json(oneWO);
	} catch (err) {
		res.json({ message: err });
	}
});

//create WO
router.post('/', async (req, res) => {
	const postWO = new Workout({
		workoutName : req.body.workoutName,
		workoutDesc : req.body.workoutDesc,
		lifts       : req.body.lifts,
		uid         : req.body.uid
	});

	const savedWO = await postWO.save();
	try {
		res.json(savedWO);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;

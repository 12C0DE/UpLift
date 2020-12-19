const express = require('express');
const router = express.Router();
const Lift = require('../models/Lift');

//get all lifts
router.get('/', async (req, res) => {
	try {
		const lifts = await Lift.find();
		res.json(lifts);
	} catch (err) {
		res.json({ message: err });
	}
});

//get specific lift
router.get('/:_id', async (req, res) => {
	try {
		const oneLift = await Lift.findById(req.params._id);
		res.json(oneLift);
	} catch (err) {
		res.json({ message: err });
	}
});

//create lift
router.post('/', async (req, res) => {
	const liftPost = new Lift({
		liftName  : req.body.liftName,
		liftDesc  : req.body.liftDesc,
		muscPrim  : req.body.muscPrim,
		muscSec   : req.body.muscSec,
		equipment : req.body.equipment
	});

	const savedLift = await liftPost.save();
	try {
		res.json(savedLift);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Muscle = require('../models/Muscle');

//get all muscles
router.get('/', async (req, res) => {
	try {
		const muscles = await Muscle.find().sort('name');
		res.json(muscles);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;

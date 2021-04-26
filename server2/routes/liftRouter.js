const express = require('express');
const router = express.Router();
const Lift = require('../models/Lift');

//get all lifts for current userId
router.get('/all/:uid', async (req, res) => {
	try {
		const lifts = await Lift.find({ uid: req.params.uid });
		res.json(lifts);
	} catch (err) {
		res.json({ message: err });
	}
});

router.get('/in'),
	async (req, res) => {
		const idList = [
			'5fe71c7803f8a0233aac7a3e',
			'5fde1e5ee620a15b4c7be497',
			'5fde1e8de620a15b4c7be498'
		];
		try {
			const lifts = await Lift.find({
				_id : {
					$elemMatch : { 
						'5fe71c7803f8a0233aac7a3e',
						'5fde1e5ee620a15b4c7be497'
          }
				}
			}).exec();
			res.json(lifts);
		} catch (err) {
			res.json({ message: err });
		}
	};

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
		equipment : req.body.equipment,
		uid       : req.body.uid
	});

	const savedLift = await liftPost.save();
	try {
		res.json(savedLift);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;

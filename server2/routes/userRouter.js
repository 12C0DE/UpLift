const express = require('express');
const router = express.Router();
const User = require('../models/User');

//get all users
router.get('/', async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		res.json({ message: err });
	}
});

//get specific user
router.get('/:uid', async (req, res) => {
	try {
		const oneUser = await User.findOne({ userid: req.params.uid });
		res.json(oneUser);
	} catch (err) {
		res.json({ message: err });
	}
});

router.post('/', async (req, res) => {
	const userPost = new User({
		email  : req.body.email,
		fname  : req.body.fname,
		lname  : req.body.lname,
		userid : req.body.userid
	});

	const savedUser = await userPost.save();
	try {
		res.json(savedUser);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;

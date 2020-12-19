const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

//finds all Posts
router.get('/', async (req, res) => {
	try {
		const posts = await Post.find();
		res.json(posts);
	} catch (error) {
		res.json({ message: error });
	}
});

//finds specific post
router.get('/:postId', async (req, res) => {
	const post = await Post.findById(req.params.postId);

	try {
		res.json(post);
	} catch (error) {
		res.json({ message: error });
	}
});

//submits post
router.post('/', async (req, res) => {
	//new post
	const post = new Post({
		title       : req.body.title,
		description : req.body.description
	});

	//async method
	const savedPost = await post.save();
	try {
		res.json(savedPost);
	} catch (err) {
		res.json({ message: err });
	}

	//non async method
	// post
	// 	.save()
	// 	.then((data) => {
	// 		res.json(data);
	// 	})
	// 	.catch((err) => {
	// 		res.json({ message: err });
	// 	});
});

//delete a post
router.delete('/:postId', async (req, res) => {
	try {
		const delPost = await Post.remove({ _id: req.params.postId });
		res.json(delPost);
	} catch (error) {
		res.json({ message: error });
	}
});

//update post
router.patch('/:postId', async (req, res) => {
	try {
		const updatePost = await Post.updateOne({ _id: req.params.postId }, { $set: { title: req.body.title } });
		res.json(updatePost);
	} catch (error) {
		res.json({ message: error });
	}
});

module.exports = router;

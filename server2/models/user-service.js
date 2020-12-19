const User = require('./User');
const ReadPreference = require('mongodb').ReadPreference;

require('../../server/mongo').connect();

function get(req, res) {
	const docQuery = User.find({}).read(ReadPreference.NEAREST);

	docQuery.exec().then((users) => res.json(users)).catch((err) => {
		res.status(500).send(err);
	});
}

function create(req, res) {
	const { email, fname, lname, userid } = req.body;

	const user = new User({ email, fname, lname, userid });
	user
		.save()
		.then(() => {
			res.json(user);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
}

module.exports = {
	get,
	create
};

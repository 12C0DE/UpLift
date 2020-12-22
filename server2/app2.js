const { urlencoded } = require('express');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

//middleware
// app.use('/post', () => {
//     console.log('this func will always run when post is hit');
// })

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.json());

//import routes
// const postsRoute = require('./routes/posts');
// app.use('/posts', postsRoute);

const userRoute = require('./routes/userRouter');
app.use('/users', userRoute);

const liftRoute = require('./routes/liftRouter');
app.use('/lifts', liftRoute);

const programRoute = require('./routes/programRouter');
app.use('/programs', programRoute);

const workoutRoute = require('./routes/workoutRouter');
app.use('/workouts', workoutRoute);

const muscleRoute = require('./routes/muscleRouter');
app.use('/muscles', muscleRoute);

//connect to db
mongoose.connect(
	process.env.DB_CONNECTION,
	{ useNewUrlParser: true, useUnifiedTopology: true, dbName: 'uplift-data' },
	() => {
		console.log('connected to DB');
	}
);

//how to start listening to the server?
app.listen(5000);

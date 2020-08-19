import React from 'react';
import { Link } from 'react-router-dom';

export const Workout = () => {
	return (
		<div>
			<h1>Workout</h1>
			<button>Make Public</button>
			<br />
			<Link to="/currlift">Start Workout</Link>
			<br />
			<Link to="/workouts">Back to Workouts</Link>
		</div>
	);
};

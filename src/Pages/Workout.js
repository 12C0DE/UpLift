import React from 'react';
import { Link } from 'react-router-dom';

export const Workout = () => {
	return (
		<div>
			<h1>Workout</h1>
			<button>Make Puibli</button>
			<Link to="/workouts">Back to Workouts</Link>
		</div>
	);
};

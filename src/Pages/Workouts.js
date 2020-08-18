import React from 'react';
import { Link } from 'react-router-dom';

export const Workouts = () => {
	return (
		<div>
			<h1>Workouts</h1>
			<Link to="/workout">Select a workout</Link>
			<br />
			<Link to="/">Back Home</Link>
		</div>
	);
};

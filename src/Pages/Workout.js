import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../Context/GlobalState';

export const Workout = () => {
	const {
		// allEquip,
		// musclesAll,
		exDescription,
		exEquip,
		exName,
		muscles,
		muscles2nd
	} = useContext(GlobalContext);

	return (
		<div>
			<h1>Workout</h1>
			<button>Make Public</button>
			<br />
			<h2>Lifts</h2>

			<br />
			<Link to="/currlift">Start Workout</Link>
			<br />
			<Link to="/workouts">Back to Workouts</Link>
		</div>
	);
};

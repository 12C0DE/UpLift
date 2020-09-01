import React from 'react';
import { Link } from 'react-router-dom';

export const WorkoutList = ({ workouts }) => {
	return (
		<ul>
			{workouts.map((wo) => (
				<li key={`li${wo.workoutID}`}>
					<Link to={`/workout/${wo.workoutID}`} key={`wo${wo.workoutID}`}>
						{wo.workoutName}
					</Link>
				</li>
			))}
		</ul>
	);
};

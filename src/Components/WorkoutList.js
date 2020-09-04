import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const WorkoutList = ({ workouts, isCB }) => {
	const [ selWO, setSelWO ] = useState([]);

	function toggleWO(e, woID) {
		e.target.checked ? setSelWO((selWO) => [ ...selWO, woID ]) : setSelWO(selWO.filter((sel) => sel !== woID));
	}

	return (
		<ul>
			{workouts.map((wo) => (
				<li key={`li${wo.workoutID}`}>
					{isCB ? (
						<input
							type="checkbox"
							checked={selWO.includes(wo.workoutID)}
							onChange={(e) => toggleWO(e, wo.workoutID)}
						/>
					) : null}
					<Link to={`/workout/${wo.workoutID}`} key={`wo${wo.workoutID}`}>
						{wo.workoutName}
					</Link>
				</li>
			))}
		</ul>
	);
};

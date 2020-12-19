import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Fbase from '../Firebase/base';

export const WorkoutList = ({ workouts, lifts, isCB, uid }) => {
	const [ selWO, setSelWO ] = useState([]);

	function toggleWO(e, woID) {
		e.target.checked ? setSelWO((selWO) => [ ...selWO, woID ]) : setSelWO(selWO.filter((sel) => sel !== woID));
	}

	// function addToWO() {
	// 	//for each workout, add the selected lifts passed thru 'lifts'
	// 	lifts.map((l) => console.log(`lifts: ${l}`));

	// 	Fbase.firestore()
	// 		.collection('workouts')
	// 		// .where('uid', '==', uid)
	// 		// .where('workoutID', '==', 2)
	// 		.update({ lifts: FieldValue.arrayUnion(5) });
	// }

	return (
		<React.Fragment>
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
			{/* {isCB ? <button onClick={() => addToWO()}>ADD</button> : null} */}
		</React.Fragment>
	);
};

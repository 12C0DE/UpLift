import React, { useState } from 'react';
import { WorkoutList } from '../Components/WorkoutList';
import Fbase from '../Firebase/base';

export const AddtoWO = ({ currentUser }) => {
	const [ showAdd, setShowAdd ] = useState(false);
	const [ wOuts, setWOuts ] = useState([]);

	function getWOs() {
		if (!wOuts.length) {
			Fbase.firestore().collection('workouts').where('uid', '==', currentUser.uid).onSnapshot((snap) => {
				const workout = snap.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
				}));
				setWOuts(workout);
			});
		}
	}

	function setupSection() {
		getWOs();
		setShowAdd(!showAdd);
	}

	return (
		<div>
			<button onClick={setupSection}>Add to Workout</button>
			{showAdd ? <WorkoutList workouts={wOuts} /> : null}
		</div>
	);
};

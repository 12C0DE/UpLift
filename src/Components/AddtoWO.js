import React, { useContext, useState } from 'react';
import { WorkoutList } from '../Components/WorkoutList';
import { GlobalContext } from '../Context/GlobalState';
import Fbase from '../Firebase/base';

export const AddtoWO = ({ currentUser, selLifts }) => {
	const [ showAdd, setShowAdd ] = useState(false);
	const [ wOuts, setWOuts ] = useState([]);
	const { showLiftCb, toggleLiftCb } = useContext(GlobalContext);

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
		toggleLiftCb(!showLiftCb);
		getWOs();
		setShowAdd(!showAdd);
	}

	return (
		<div>
			<button onClick={setupSection}>Add to Workout</button>
			{showAdd ? <WorkoutList workouts={wOuts} isCB={true} /> : null}
			<button
				onClick={() => {
					selLifts.map((sel) => console.log(`sellift: ${sel}`));
				}}
			>
				check con
			</button>
		</div>
	);
};

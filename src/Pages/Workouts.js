import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Firebase/Auth';
import Fbase from '../Firebase/base';

export const Workouts = () => {
	const { currentUser } = useContext(AuthContext);

	function GetWorkouts() {
		const [ workouts, setWorkouts ] = useState([]);

		useEffect(
			() => {
				const unsubscribe = Fbase.firestore()
					.collection('workouts')
					.where('uid', '==', currentUser.uid)
					.onSnapshot((snap) => {
						const workout = snap.docs.map((doc) => ({
							id: doc.id,
							...doc.data()
						}));
						setWorkouts(workout);
					});
				return () => {
					unsubscribe();
				};
			},
			[ workouts ]
		);
		return workouts;
	}

	const wOuts = GetWorkouts();

	return (
		<div>
			<h1>Workouts</h1>
			<ul>
				{wOuts.map((wo) => (
					<Link to="/workout" key={`wo${wo.workoutID}`}>
						{wo.workoutName}
					</Link>
				))}
			</ul>
			<Link to="/workout">Select a workout</Link>
			<br />
			<Link to="/">Back Home</Link>
		</div>
	);
};

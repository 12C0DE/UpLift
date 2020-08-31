import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Firebase/Auth';
import Fbase from '../Firebase/base';

export const Workouts = () => {
	const { currentUser } = useContext(AuthContext);
	const [ workouts, setWorkouts ] = useState([]);

	useEffect(() => {
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
	}, []);

	return (
		<div>
			<h1>Workouts</h1>
			<ul>
				{workouts.map((wo) => (
					<Link to={`/workout/${wo.workoutID}`} key={`wo${wo.workoutID}`}>
						{wo.workoutName}
					</Link>
				))}
			</ul>
			<br />
			<Link to="/">Back Home</Link>
		</div>
	);
};

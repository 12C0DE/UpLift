import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GlobalContext } from '../Context/GlobalState';
import { AuthContext } from '../Firebase/Auth';
import Fbase from '../Firebase/base';

export const Workout = () => {
	const { currentUser } = useContext(AuthContext);
	const { wid } = useParams();
	const [ workout, setWorkout ] = useState([]);
	const [ liftArr, setLiftArr ] = useState([]);
	let liftIDArr = [];

	const {
		// allEquip,
		// musclesAll,
		setExDesc,
		setExEquip,
		setExName,
		setMuscles,
		setMuscles2nd
	} = useContext(GlobalContext);

	useEffect(() => {
		const unsubscribe = Fbase.firestore()
			.collection('workouts')
			.where('uid', '==', currentUser.uid)
			.where('workoutID', '==', +wid)
			.onSnapshot((snap) => {
				const wrkout = snap.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
				}));
				setWorkout(wrkout);
				liftIDArr = wrkout[0].lifts.slice();
				getLifts();
			});
		return () => {
			unsubscribe();
		};
	}, []);

	function getLifts() {
		Fbase.firestore()
			.collection('lifts')
			.where('uid', '==', currentUser.uid)
			.where('liftID', 'in', liftIDArr)
			.onSnapshot((snap) => {
				const lift = snap.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
				}));
				setLiftArr(lift);
			});
	}

	function setExValues(ex) {
		setExDesc(ex.liftDesc);
		setExEquip(ex.equip);
		setExName(ex.liftName);
		setMuscles(ex.muscPrim);
		setMuscles2nd(ex.muscSec);
	}

	return (
		<div>
			<h1>Workout</h1>
			<button>Make Public</button>
			<br />
			{workout.map((wo) => (
				<div key={`d${wo.workoutID}`}>
					<h4>{wo.workoutName}</h4>
					<h4>{wo.workoutDesc}</h4>
					{wo.lifts.map((lf) => <h5 key={`l${lf}`}>{lf}</h5>)}
				</div>
			))}
			<br />
			<h2>Lifts</h2>
			<div>
				{liftArr.map((l) => (
					<React.Fragment key={`rf${l.id}`}>
						<Link key={`lN${l.id}`} to="/exercise" onClick={() => setExValues(l)}>
							{l.liftName}
						</Link>
						<h4 key={`lD${l.id}`}>Desc: {l.liftDesc}</h4>
					</React.Fragment>
				))}
			</div>
			<br />
			<Link to="/currlift">Start Workout</Link>
			<br />
			<Link to="/workouts">Back to Workouts</Link>
		</div>
	);
};

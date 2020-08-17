import React, { useContext, useEffect, useState } from 'react';
import Fbase from '../Firebase/base';
import { LogoutBtn } from '../Components/LogoutBtn';
import { AuthContext } from '../Firebase/Auth';
import { GlobalContext } from '../Context/GlobalState';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Home = () => {
	const { musclesAll, setAllEquip, setMusclesAll } = useContext(GlobalContext);

	function GetName() {
		const { currentUser } = useContext(AuthContext);
		const [ fname, setFname ] = useState(null);

		useEffect(
			() => {
				Fbase.firestore().collection('users').where('uid', '==', currentUser.uid).onSnapshot((dt) => {
					const user = dt.docs.filter((doc) => doc.data).map((doc) => ({
						id: doc.id,
						...doc.data()
					}));
					console.log('ran getName()');
					setFname(user[0].fname);
				});

				retrieveExerciseData();
			},
			[ currentUser.uid ]
		);
		return fname;
	}

	function retrieveExerciseData() {
		if (!musclesAll.length) {
			axios
				.all([ axios.get('https://wger.de/api/v2/muscle/'), axios.get('https://wger.de/api/v2/equipment/') ])
				.then(
					axios.spread((muscs, equip) => {
						setMusclesAll(muscs.data);
						setAllEquip(equip.data);
					})
				);
		}
	}

	const userFname = GetName();

	return (
		<div>
			<div>
				<h1>Home</h1>
			</div>
			<div>
				<h2>Welcome {userFname}</h2>
			</div>
			<div>
				<Link to="/lifts">Lifts</Link>
			</div>
			<div>
				<Link to="/addlift">Add Lift</Link>
			</div>
			<div>
				<Link to="/about">About</Link>
			</div>
			<br />
			<div>
				<LogoutBtn />
			</div>
		</div>
	);
};

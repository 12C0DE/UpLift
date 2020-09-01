import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Firebase/Auth';
import { GlobalContext } from '../Context/GlobalState';
import { AddtoWO } from '../Components/AddtoWO';
import Fbase from '../Firebase/base';

export const Lifts = () => {
	const { currentUser } = useContext(AuthContext);
	const [ lifts, setLifts ] = useState([]);

	const { setExDesc, setExEquip, setExName, setMuscles, setMuscles2nd } = useContext(GlobalContext);

	useEffect(() => {
		const unsubscribe = Fbase.firestore()
			.collection('lifts')
			.where('uid', '==', currentUser.uid)
			.onSnapshot((snap) => {
				const lift = snap.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
				}));
				setLifts(lift);
			});
		return () => {
			unsubscribe();
		};
	}, []);

	function setExValues(ex) {
		setExDesc(ex.liftDesc);
		setExEquip(ex.equip);
		setExName(ex.liftName);
		setMuscles(ex.muscPrim);
		setMuscles2nd(ex.muscSec);
	}

	return (
		<div>
			<h1>Your Lifts</h1>
			<br />
			<ul>
				{lifts.map((l) => (
					<li key={`li${l.liftID}`}>
						<Link key={`l${l.liftID}`} to="/exercise" onClick={() => setExValues(l)}>
							{l.liftName}
						</Link>
						<span> - {l.liftDesc}</span>
					</li>
				))}
			</ul>
			<AddtoWO currentUser={currentUser} />
			<br />
			<Link to="/">Back Home</Link>
		</div>
	);
};

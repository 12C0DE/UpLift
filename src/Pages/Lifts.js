import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Firebase/Auth';
import { GlobalContext } from '../Context/GlobalState';
import { AddtoWO } from '../Components/AddtoWO';
import Fbase from '../Firebase/base';

export const Lifts = () => {
	const { currentUser } = useContext(AuthContext);
	const [ lifts, setLifts ] = useState([]);
	const [ selLifts, setSelLifts ] = useState([]);

	const { setExDesc, setExEquip, setExName, setMuscles, setMuscles2nd, showLiftCb, toggleLiftCb } = useContext(
		GlobalContext
	);

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
				toggleLiftCb(false);
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

	function toggleLift(e, liftID) {
		e.target.checked
			? setSelLifts((selLifts) => [ ...selLifts, liftID ])
			: setSelLifts(selLifts.filter((lift) => lift !== liftID));
	}

	return (
		<div>
			<h1>Your Lifts</h1>
			<br />
			<ul>
				{lifts.map((l) => (
					<li key={`li${l.liftID}`}>
						{showLiftCb ? (
							<input
								type="checkbox"
								checked={selLifts.includes(l.liftID)}
								onChange={(e) => toggleLift(e, l.liftID)}
							/>
						) : null}
						<Link key={`l${l.liftID}`} to="/exercise" onClick={() => setExValues(l)}>
							{l.liftName}
						</Link>
						<span> - {l.liftDesc}</span>
					</li>
				))}
			</ul>
			<AddtoWO currentUser={currentUser} selLifts={selLifts} />
			<br />
			<Link to="/">Back Home</Link>
		</div>
	);
};

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Firebase/Auth';
import Fbase from '../Firebase/base';

export const Lifts = () => {
	const { currentUser } = useContext(AuthContext);
	const [ lifts, setLifts ] = useState([]);

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

	return (
		<div>
			<h1>Your Lifts</h1>
			<br />
			<Link to="/">Back Home</Link>
		</div>
	);
};

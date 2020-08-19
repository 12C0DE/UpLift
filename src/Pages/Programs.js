import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Firebase/Auth';
import Fbase from '../Firebase/base';

export const Programs = () => {
	const { currentUser } = useContext(AuthContext);

	function GetPrograms() {
		const [ programs, setPrograms ] = useState([]);

		useEffect(() => {
			const unsubscribe = Fbase.firestore()
				.collection('programs')
				.where('uid', '==', currentUser.uid)
				.onSnapshot((snap) => {
					const program = snap.docs.map((doc) => ({
						id: doc.id,
						...doc.data()
					}));
					setPrograms(program);
				});
			return () => {
				unsubscribe();
			};
		}, []);
		return programs;
	}

	const progs = GetPrograms();

	return (
		<div>
			<h1>Programs</h1>
			<ul>{progs.map((prog) => <li key={`prog${prog.programID}`}>{prog.programName}</li>)}</ul>
			<Link to="/programs">Create A Program</Link>
			<br />
			<Link to="/programs">Update Program</Link>
			<br />
			<Link to="/">Back Home</Link>
		</div>
	);
};

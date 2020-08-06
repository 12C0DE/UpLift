import React, { useContext, useEffect, useState } from 'react';
import Fbase from '../Firebase/base';
import { AuthContext } from '../Firebase/Auth';
import DataFetching from '../DataFetch/DataFetching';

export const Home = () => {
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
			},
			[ currentUser.uid ]
		);
		return fname;
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
				<DataFetching url="https://wger.de/api/v2/exercise/" />
				<button>Get Data</button>
			</div>
			<div>
				<button onClick={() => Fbase.auth().signOut()}>Sign out</button>
			</div>
		</div>
	);
};

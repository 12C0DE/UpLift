import React from 'react';
import Fbase from '../Firebase/base';

export const Home = () => {
	return (
		<div>
			<h1>Home</h1>
			<button onClick={() => Fbase.auth().signOut()}>Sign out</button>
		</div>
	);
};

import React from 'react';
import { Link } from 'react-router-dom';

export const Exercise = () => {
	return (
		<div>
			<h1>Exercise</h1>
			<Link to="/lifts">Back to Lifts</Link>
		</div>
	);
};

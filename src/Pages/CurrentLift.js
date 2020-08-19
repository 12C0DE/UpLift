import React from 'react';
import { Link } from 'react-router-dom';

export const CurrentLift = () => {
	return (
		<div>
			<h1>Current Lift</h1>
			<h2>Lift Name</h2>
			<h4>Lift Desc</h4>
			<label>
				Enter Weight Amount
				<input type="number" />
			</label>
			<label>
				Set
				<input type="number" />
			</label>
			<br />
			<button>View Previous</button>
			<button>View Next</button>
			<br />
			<button>Quit Lift</button>
			<button>Complete Lift</button>
			<br />
			<i>Last lift you did...</i>
			<br />
			<Link to="/">Back Home</Link>
		</div>
	);
};

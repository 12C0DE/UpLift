import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../Context/GlobalState';

export const Exercise = () => {
	const { exDescription, exEquip, exName, muscles, muscles2nd, selectedItem } = useContext(GlobalContext);
	return (
		<div>
			<h1>Exercise</h1>
			<div>
				<h2>Name: {exName}</h2>
				<h2>Desc: {exDescription}</h2>
				<h2>Equipment: {exEquip}</h2>
				{/* <h2>Muscles: {muscles.map((musc) => `${musc} `)}</h2>
				<h2>2nd Muscles: {muscles2nd.map((musc2) => `${musc2} `)}</h2> */}
			</div>
			<div>
				<button>Add to Workout</button>
			</div>
			<br />
			<div>
				{muscles2nd.map((musc2) => (
					<img key={musc2} style={{ height: '100px', width: '100px' }} src={`../img/muscle_${musc2}_2.svg`} />
				))}
				{muscles.map((musc) => (
					<img key={musc} style={{ height: '100px', width: '100px' }} src={`../img/muscle_${musc}_1.svg`} />
				))}
			</div>
			<Link to="/lifts">Back to Lifts</Link>
		</div>
	);
};

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../Context/GlobalState';
import muscFront from '../img/muscleFront.svg';
import muscBack from '../img/muscleBack.svg';
import axios from 'axios';

export const Exercise = () => {
	const { exDescription, exEquip, exName, muscles, muscles2nd, selectedItem } = useContext(GlobalContext);
	const [ muscSide, setMuscSide ] = useState([]);
	const frontMuscs = [];
	const backMuscs = [];

	useEffect(() => {
		axios
			.get('https://wger.de/api/v2/muscle/')
			.then((res) => {
				setMuscSide(res.data);
			})
			.catch((err) => {
				console.log(`err: ${err}`);
			});
	}, []);

	return (
		<div>
			<h1>Exercise</h1>
			<div>
				<h2>Name: {exName}</h2>
				<h2>Desc: {exDescription}</h2>
				<h2>Equipment: {exEquip}</h2>
				<h2>Muscles: {muscles.map((musc) => `${musc} `)}</h2>
				<h2>2nd Muscles: {muscles2nd.map((musc2) => `${musc2} `)}</h2>
			</div>
			<div>
				<button>Add to Workout</button>
			</div>
			<br />
			<div>
				<img src={muscFront} className="muscFront" style={{ zIndex: '1' }} />
				<img src={muscBack} className="muscBack" style={{ zIndex: '1' }} />
				{muscles2nd.map((musc2) => (
					<img
						key={`musc2${musc2}`}
						className="muscFront"
						style={{ zIndex: '2' }}
						src={require(`../img/muscle_${musc2}_2.svg`)}
					/>
				))}
				{muscles.map((musc) => (
					<img
						key={`musc${musc}`}
						className="muscBack"
						style={{ zIndex: '3' }}
						src={require(`../img/muscle_${musc}_1.svg`)}
					/>
				))}
			</div>
			<Link to="/lifts">Back to Lifts</Link>
		</div>
	);
};

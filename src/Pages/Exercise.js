import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../Context/GlobalState';
import { MuscImg } from '../Components/MuscImg';
import muscFront from '../img/muscleFront.svg';
import muscBack from '../img/muscleBack.svg';
import axios from 'axios';

export const Exercise = () => {
	const [ primMusc, setPrimMuscs ] = useState([]);
	const [ secMuscs, setSecMuscs ] = useState([]);
	const {
		exDescription,
		exEquip,
		exName,
		muscles,
		musclesAll,
		muscles2nd,
		musclesBack,
		musclesFront,
		addMusclesBack,
		addMusclesFront,
		setMusclesAll
	} = useContext(GlobalContext);

	function updateMuscCount() {
		addMusclesBack(0);
		addMusclesFront(0);
	}

	useEffect(
		() => {
			axios
				.get('https://wger.de/api/v2/muscle/')
				.then((res) => {
					setMusclesAll(res.data);

					let intersectionPrims = musclesAll.filter((ones) => muscles.includes(ones.id));
					let intersectionSec = musclesAll.filter((twos) => muscles2nd.includes(twos.id));
					setPrimMuscs(intersectionPrims);
					setSecMuscs(intersectionSec);
				})
				.catch((err) => {
					console.log(`err: ${err}`);
				});
		},
		// [ muscles, muscles2nd, musclesAll, setMusclesAll ]
		[] //find a way to include correct dependencies without it running infinitely
	);

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
				{secMuscs.map((musc2) => (
					<MuscImg key={`musc${musc2.id}`} muscleId={musc2.id} isFrst={false} isFront={musc2.is_front} />
				))}
				{primMusc.map((musc) => (
					<MuscImg key={`musc${musc.id}`} muscleId={musc.id} isFrst={true} isFront={musc.is_front} />
				))}
				{musclesFront > 0 ? (
					<img src={muscFront} alt="muscFront" className="muscFront" style={{ zIndex: '1' }} />
				) : null}
				{musclesBack > 0 ? (
					<img src={muscBack} className="muscBack" alt="muscBack" style={{ zIndex: '1' }} />
				) : null}
			</div>
			<Link to="/lifts" onClick={updateMuscCount}>
				Back to Lifts
			</Link>
		</div>
	);
};

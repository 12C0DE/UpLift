import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../Context/GlobalState';
import { MuscImg } from '../Components/MuscImg';
import muscFront from '../img/muscleFront.svg';
import muscBack from '../img/muscleBack.svg';

export const Exercise = () => {
	const [ primMusc, setPrimMuscs ] = useState([]);
	const [ secMuscs, setSecMuscs ] = useState([]);
	const [ equipName, setEquipName ] = useState([]);
	const {
		allEquip,
		exDescription,
		exEquip,
		exName,
		muscles,
		musclesAll,
		muscles2nd,
		musclesBack,
		musclesFront,
		addMusclesBack,
		addMusclesFront
	} = useContext(GlobalContext);

	function updateMuscCount() {
		addMusclesBack(0);
		addMusclesFront(0);
	}

	useEffect(
		() => {
			let intersectionPrims = musclesAll.filter((ones) => muscles.includes(ones.id));
			let intersectionSec = musclesAll.filter((twos) => muscles2nd.includes(twos.id));
			setPrimMuscs(intersectionPrims);
			setSecMuscs(intersectionSec);

			let intersectionEquip = allEquip.filter((eq) => exEquip.includes(eq.id));
			setEquipName(intersectionEquip);
		},
		[] //find a way to include correct dependencies without it running infinitely
	);

	return (
		<div>
			<h1>Exercise</h1>
			<div>
				<h2>Name: {exName}</h2>
				<h2>Desc: {exDescription}</h2>
				<h2>Equipment: {equipName.map((eq) => `${eq.name} `)}</h2>
				<h2>Primary Muscles: {primMusc.map((musc) => `${musc.name} `)}</h2>
				<h2>Secondary Muscles: {secMuscs.map((musc) => `${musc.name} `)}</h2>
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
			<Link to="/excats" onClick={updateMuscCount}>
				Back to Categories
			</Link>
		</div>
	);
};

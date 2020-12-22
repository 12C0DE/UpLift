import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../Context/GlobalState';
import { AuthContext } from '../Firebase/Auth';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const AddLift = () => {
	const { currentUser } = useContext(AuthContext);
	const {
		allEquip,
		musclesAll
		// exDescription,
		// exEquip,
		// exName,
		// muscles,
		// muscles2nd,
		// setExDesc,
		// setExEquip,
		// setExName,
		// setMuscles,
		// setMuscles2nd
	} = useContext(GlobalContext);

	const [
		lift,
		setLift
	] = useState([]);
	const [
		name,
		setName
	] = useState('');
	const [
		desc,
		setDesc
	] = useState('');
	const [
		equip,
		setEquip
	] = useState([]);
	const [
		musc,
		setMusc
	] = useState([]);
	const [
		musc2,
		setMusc2
	] = useState([]);
	const [
		isPrimary,
		setIsPrimary
	] = useState(true);

	function SetArrField(e, liftID, arrType) {
		switch (arrType) {
			case 'EQUIP':
				if (e.target.checked) {
					setEquip((equip) => [
						...equip,
						liftID
					]);
				} else {
					setEquip(equip.filter((eq) => eq !== liftID));
				}
				return;
			case 'MUSC':
				if (e.target.checked) {
					setMusc((musc) => [
						...musc,
						liftID
					]);
				} else {
					setMusc(musc.filter((eq) => eq !== liftID));
				}
				return;
			case 'MUSC2':
				if (e.target.checked) {
					setMusc2((musc2) => [
						...musc2,
						liftID
					]);
				} else {
					setMusc2(musc2.filter((eq) => eq !== liftID));
				}
				return;
			default:
				return;
		}
	}

	const onSubmit = (e) => {
		e.preventDefault();

		//if lift name or description is empty, dont save
		if (!name || !desc) {
			return;
		}

		const newLift = {
			// Id        : newID,
			liftName  : name,
			liftDesc  : desc,
			muscPrim  : musc,
			muscSec   : musc2,
			equipment : equip
		};

		axios
			.post('/lifts', newLift)
			.then(() => {
				//save to context
				// 		// setExName(name);
				// 		// setExDesc(desc);
				// 		// setExEquip(equip);
				// 		// setMuscles(musc);
				// 		// setMuscles2nd(musc2);

				setName('');
				setDesc('');
				setEquip([]);
				setMusc([]);
				setMusc2([]);
				setIsPrimary(true);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div>
			<h1>Add Lift</h1>
			<form onSubmit={onSubmit}>
				<label htmlFor="name">
					Name
					<input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
				</label>
				<label htmlFor="description">
					Description
					<textarea type="text" id="description" value={desc} onChange={(e) => setDesc(e.target.value)} />
				</label>
				<br />
				<label htmlFor="equipment">Equipment</label>
				<ul>
					{allEquip.map((eq) => (
						<li key={eq.muscleId}>
							<input
								key={`cbE${eq.id}`}
								type="checkbox"
								onChange={(e) => SetArrField(e, eq.id, 'EQUIP')}
								checked={

										equip.includes(eq.id) ? true :
										false
								}
							/>
							<label>{eq.name}</label>
						</li>
					))}
				</ul>
				<label>Muscles</label>
				<input type="checkbox" id="musc1" checked={isPrimary} onChange={() => setIsPrimary(!isPrimary)} />
				<label>Primary</label>
				<input type="checkbox" id="musc2" checked={!isPrimary} onChange={() => setIsPrimary(!isPrimary)} />
				<label>Secondary</label>
				<ul>
					{musclesAll.map((mus) => (
						<li key={mus.muscleId}>
							<input
								key={`cbM${mus.muscleId}`}
								type="checkbox"
								checked={

										musc.includes(mus.muscleId) || musc2.includes(mus.muscleId) ? true :
										false
								}
								onChange={(e) =>
									SetArrField(
										e,
										mus.muscleId,

											isPrimary ? 'MUSC' :
											'MUSC2'
									)}
							/>
							<label>{mus.name}</label>
						</li>
					))}
				</ul>
				<button>Add Lift</button>
				<br />
			</form>
			<button>Add to Workout</button>
			<Link to="/">Back Home</Link>
		</div>
	);
};

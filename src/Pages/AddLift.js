import React, { useContext, useState } from 'react';
import { GlobalContext } from '../Context/GlobalState';
import { AuthContext } from '../Firebase/Auth';
import { Link } from 'react-router-dom';
import Fbase from '../Firebase/base';

export const AddLift = (e) => {
	const { currentUser } = useContext(AuthContext);
	const {
		allEquip,
		musclesAll
		//exDescription,
		// exEquip,
		//exName,
		// muscles,
		// muscles2nd,
		//setExDesc,
		// setExEquip,
		//setExName
		// setMuscles,
		// setMuscles2nd
	} = useContext(GlobalContext);
	// const [ lift, setLift ] = useState([]);
	const [ name, setName ] = useState('');
	const [ desc, setDesc ] = useState('');
	const [ equip, setEquip ] = useState([]);
	const [ musc, setMusc ] = useState([]);
	const [ musc2, setMusc2 ] = useState([]);
	const [ isPrimary, setIsPrimary ] = useState(true);
	const [ newID, setNewID ] = useState(1);

	function getNewID() {
		let newID = 0;

		Fbase.firestore().collection('lifts').orderBy('liftID', 'desc').limit(1).onSnapshot((snap) => {
			const nID = snap.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}));
			setNewID(nID[0].liftID + 1);
		});
		return newID;
	}

	function uncheck(type, list) {
		list.map((ls) => {
			document.getElementById(`${type}${ls.id}`).checked = false;
			// console.log(`${type}${ls}`);
		});
	}

	function SetArrField(e, liftID, arrType) {
		switch (arrType) {
			case 'EQUIP':
				if (e.target.checked) {
					setEquip((equip) => [ ...equip, liftID ]);
				} else {
					setEquip(equip.filter((eq) => eq !== liftID));
				}
				return;
			case 'MUSC':
				if (e.target.checked) {
					setMusc((musc) => [ ...musc, liftID ]);
				} else {
					setMusc(musc.filter((eq) => eq !== liftID));
				}
				return;
			case 'MUSC2':
				if (e.target.checked) {
					setMusc2((musc2) => [ ...musc2, liftID ]);
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

		// if (!{ name }) {
		// 	return;
		// }

		uncheck('cbE', equip);
		uncheck('cbM', musc);
		uncheck('cbM', musc2);
		return;

		getNewID();

		const newLift = {
			Id: newID,
			Name: name,
			Desc: desc,
			musc1: musc,
			musc2: musc2,
			equip: equip,
			uid: currentUser.uid
		};

		Fbase.firestore()
			.collection('lifts')
			.add({
				liftID: newLift.Id,
				liftName: newLift.Name,
				liftDesc: newLift.Desc,
				muscPrim: newLift.musc1,
				muscSec: newLift.musc2,
				equip: newLift.equip,
				uid: newLift.uid
			})
			.then(() => {
				setName('');
				setDesc('');
				setEquip([]);
				setMusc([]);
				setMusc2([]);
				setIsPrimary(true);
			});

		console.log(`newID: ${newID}`);
	};

	return (
		<div>
			<h1>Add Lift</h1>
			<form onSubmit={onSubmit}>
				<label htmlFor="name">
					Name
					<input type="text" id="name" onChange={(e) => setName(e.target.value)} />
				</label>
				<label htmlFor="description">
					Description
					<input type="text" id="description" onChange={(e) => setDesc(e.target.value)} />
				</label>
				<br />
				<label htmlFor="equipment">Equipment</label>
				<ul>
					{allEquip.map((eq) => (
						<li key={eq.id}>
							<input
								key={`cbE${eq.id}`}
								type="checkbox"
								onChange={(e) => SetArrField(e, eq.id, 'EQUIP')}
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
					{musclesAll.map((musc) => (
						<li key={musc.id}>
							<input
								key={`cbM${musc.id}`}
								type="checkbox"
								onChange={(e) => SetArrField(e, musc.id, isPrimary ? 'MUSC' : 'MUSC2')}
							/>
							<label>{musc.name}</label>
						</li>
					))}
				</ul>
				<button>Add Lift</button>
			</form>
			<Link to="/">Back Home</Link>
		</div>
	);
};

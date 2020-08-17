import React, { useContext } from 'react';
import { GlobalContext } from '../Context/GlobalState';
import { Link } from 'react-router-dom';

export const AddLift = () => {
	const { allEquip, musclesAll } = useContext(GlobalContext);

	return (
		<div>
			<h1>Add Lift</h1>
			<form>
				<label>
					Name
					<input type="text" id="name" />
				</label>
				<label>
					Description
					<input type="text" id="desc" />
				</label>
				<label>
					Equipment
					{/* <input type="text" id="equipment" /> */}
				</label>
				<ul>{allEquip.map((eq) => <li key={eq.id}>{eq.name}</li>)}</ul>
				<label>Muscles</label>
				<ul>{musclesAll.map((musc) => <li key={musc.id}>{musc.name}</li>)}</ul>
				<button>Add Lift</button>
			</form>
			<Link to="/">Back Home</Link>
		</div>
	);
};

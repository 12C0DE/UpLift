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
				<br />
				<label>Equipment</label>
				<ul>
					{allEquip.map((eq) => (
						<li key={eq.id}>
							<input key={`cb${eq.id}`} type="checkbox" />
							<label>{eq.name}</label>
						</li>
					))}
				</ul>
				<label>Muscles</label>
				<input type="checkbox" />
				<label>Primary</label>
				<input type="checkbox" />
				<label>Secondary</label>
				<ul>{musclesAll.map((musc) => <li key={musc.id}>{musc.name}</li>)}</ul>
				<button>Add Lift</button>
			</form>
			<Link to="/">Back Home</Link>
		</div>
	);
};

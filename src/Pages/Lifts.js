import React, { useContext } from 'react';
import NameFetching from '../DataFetch/NameFetching';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../Context/GlobalState';

export const Lifts = () => {
	const { categoryShown, loading, selectedItem } = useContext(GlobalContext);

	return (
		<div>
			<h1>Lifts</h1>
			<div>
				<h2>Muscle groups</h2>
				<NameFetching
					url="https://wger.de/api/v2/exercisecategory/?status=2"
					category="exercisecategory"
					path="/lifts"
				/>
				{categoryShown === 'exercisecategory' ? (
					<NameFetching
						path="/exercise"
						url={`https://wger.de/api/v2/exercise/?status=2&language=2&category=${selectedItem}`}
					/>
				) : null}
			</div>
			<div>
				<h2>Specific Muscles</h2>
				<NameFetching url="https://wger.de/api/v2/muscle/?status=2" category="muscle" path="/lifts" />
				{categoryShown === 'muscle' ? (
					<NameFetching
						path="/exercise"
						url={`https://wger.de/api/v2/exercise/?status=2&language=2&muscles=${selectedItem}`}
					/>
				) : null}
			</div>
			<div>
				<h2>Equipment</h2>
				<NameFetching url="https://wger.de/api/v2/equipment/?status=2" category="equipment" path="/lifts" />
				{categoryShown === 'equipment' ? (
					<NameFetching
						path="/exercise"
						url={`https://wger.de/api/v2/exercise/?status=2&language=2&equipment=${selectedItem}`}
					/>
				) : null}
			</div>
			<Link to="/">Back Home</Link>
			<div>{loading ? <h1>LOADING</h1> : null}</div>
		</div>
	);
};

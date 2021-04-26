import React, { useContext } from 'react';
import NameFetching from '../DataFetch/NameFetching';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../Context/GlobalState';

export const ExCats = () => {
	const { categoryShown, selectedItem } = useContext(GlobalContext);

	return (
		<div>
			<h1>Exercise Categories</h1>
			<div>
				<h2>Muscle groups</h2>
				<NameFetching
					url="https://wger.de/api/v2/exercisecategory/?status=2"
					category="exercisecategory"
					path="/excats"
				/>
				{
					categoryShown === 'exercisecategory' ? <NameFetching
						category="exercisecategory"
						path="/exercise"
						url={`https://wger.de/api/v2/exercise/?status=2&language=2&category=${selectedItem}`}
					/> :
					null}
			</div>
			<div>
				<h2>Specific Muscles</h2>
				<NameFetching url="/muscles" category="muscle" path="/excats" />
				{
					categoryShown === 'muscle' ? <NameFetching
						category="muscle"
						path="/exercise"
						url={`https://wger.de/api/v2/exercise/?status=2&language=2&muscles=${selectedItem}`}
					/> :
					null}
			</div>
			<div>
				<h2>Equipment</h2>
				<NameFetching url="https://wger.de/api/v2/equipment/?status=2" category="equipment" path="/excats" />
				{
					categoryShown === 'equipment' ? <NameFetching
						category="equipment"
						path="/exercise"
						url={`https://wger.de/api/v2/exercise/?status=2&language=2&equipment=${selectedItem}`}
					/> :
					null}
			</div>
			<Link to="/">Back Home</Link>
		</div>
	);
};

import React, { useContext } from 'react';
import { GlobalContext } from '../Context/GlobalState';

export const MuscImg = (props) => {
	const { musclesBack, musclesFront, addMusclesBack, addMusclesFront } = useContext(GlobalContext);

	function updateMuscCount(muscSide) {
		muscSide ? addMusclesFront(musclesFront + 1) : addMusclesBack(musclesBack + 1);
	}

	return (
		<img
			onLoad={() => updateMuscCount(props.isFront)}
			className={props.isFront ? 'muscFront' : 'muscBack'}
			alt={`musc_${props.muscleId}`}
			style={{ zIndex: `${props.isFrst ? '3' : '2'}` }}
			src={require(`../img/muscle_${props.muscleId}_${props.isFrst ? '1' : '2'}.svg`)}
		/>
	);
};

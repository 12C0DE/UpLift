import React from 'react';

export const MuscImg = (props) => {
	return (
		<img
			className={props.isFront ? 'muscFront' : 'muscBack'}
			alt={`musc_${props.muscleId}`}
			style={{ zIndex: `${props.isFrst ? '3' : '2'}` }}
			src={require(`../img/muscle_${props.muscleId}_${props.isFrst ? '1' : '2'}.svg`)}
		/>
	);
};

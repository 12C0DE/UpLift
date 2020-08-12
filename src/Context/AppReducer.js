export default (state, action) => {
	switch (action.type) {
		case 'EX_DESC':
			return {
				...state,
				exDescription: action.payload
			};
		case 'EX_EQUIP':
			return {
				...state,
				exEquip: action.payload
			};
		case 'EX_NAME':
			return {
				...state,
				exName: action.payload
			};
		case 'MUSCLES':
			return {
				...state,
				// muscles: [ action.payload, ...state.muscles ]
				muscles: action.payload
			};
		case 'MUSC_ALL':
			return {
				...state,
				musclesAll: action.payload
			};
		case 'MUSCLES_2ND':
			return {
				...state,
				// muscles2nd: [ action.payload, ...state.muscles2nd ]
				muscles2nd: action.payload
			};
		case 'ADD_MUSCB':
			return {
				...state,
				musclesBack: action.payload
			};
		case 'ADD_MUSCF':
			return {
				...state,
				musclesFront: action.payload
			};
		case 'IS_LOAD':
			return {
				...state,
				loading: action.payload
			};
		case 'SEL_ITEM':
			return {
				...state,
				selectedItem: action.payload
			};
		case 'SHOW_CAT':
			return {
				...state,
				categoryShown: action.payload
			};
		default:
			return state;
	}
};

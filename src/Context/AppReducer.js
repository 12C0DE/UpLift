export default (state, action) => {
	switch (action.type) {
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
		default:
			return state;
	}
};

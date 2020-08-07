export default (state, action) => {
	switch (action.type) {
		case 'SEL_CAT':
			return {
				...state,
				selectedCategory: action.payload
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

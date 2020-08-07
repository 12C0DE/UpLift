import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import { initializeApp } from 'firebase';

//Initial State
const initialState = {
	selectedCategory: 0,
	categoryShown: null
};

//Create context
export const GlobalContext = createContext(initialState);

//Provider Component
export const GlobalProvider = ({ children }) => {
	const [ state, dispatch ] = useReducer(AppReducer, initialState);

	//Actions
	function showCategory(category) {
		dispatch({
			type: 'SHOW_CAT',
			payload: category
		});
	}

	function selectCategory(category) {
		dispatch({
			type: 'SEL_CAT',
			payload: category
		});
	}

	return (
		<GlobalContext.Provider
			value={{
				selectedCategory: state.selectedCategory,
				categoryShown: state.categoryShown,
				selectCategory,
				showCategory
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

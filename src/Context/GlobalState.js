import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';

//Initial State
const initialState = {
	categoryShown: null,
	exDescription: null,
	exEquip: [],
	exName: null,
	loading: false,
	muscles: [],
	muscles2nd: [],
	musclesAll: [],
	selectedItem: 0
};

//Create context
export const GlobalContext = createContext(initialState);

//Provider Component
export const GlobalProvider = ({ children }) => {
	const [ state, dispatch ] = useReducer(AppReducer, initialState);

	//Actions
	function IsLoading(isLoading) {
		dispatch({
			type: 'IS_LOAD',
			payload: isLoading
		});
	}

	function selectItem(itemId) {
		dispatch({
			type: 'SEL_ITEM',
			payload: itemId
		});
	}

	function setMusclesAll(musclesAll) {
		dispatch({
			type: 'MUSC_ALL',
			payload: musclesAll
		});
	}

	function setExDesc(exDesc) {
		dispatch({
			type: 'EX_DESC',
			payload: exDesc
		});
	}

	function setExEquip(exEquip) {
		dispatch({
			type: 'EX_EQUIP',
			payload: exEquip
		});
	}

	function setExName(exName) {
		dispatch({
			type: 'EX_NAME',
			payload: exName
		});
	}

	function setMuscles(muscles) {
		dispatch({
			type: 'MUSCLES',
			payload: muscles
		});
	}

	function setMuscles2nd(muscles2) {
		dispatch({
			type: 'MUSCLES_2ND',
			payload: muscles2
		});
	}

	function showCategory(category) {
		dispatch({
			type: 'SHOW_CAT',
			payload: category
		});
	}

	return (
		<GlobalContext.Provider
			value={{
				exDescription: state.exDescription,
				exEquip: state.exEquip,
				exName: state.exName,
				categoryShown: state.categoryShown,
				loading: state.loading,
				muscles: state.muscles,
				muscles2nd: state.muscles2nd,
				musclesAll: state.musclesAll,
				selectedItem: state.selectedItem,
				IsLoading,
				selectItem,
				setExDesc,
				setExEquip,
				showCategory,
				setExName,
				setMusclesAll,
				setMuscles,
				setMuscles2nd
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

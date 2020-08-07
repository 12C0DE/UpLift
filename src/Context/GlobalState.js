import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

//Initial State
const initialState = {
  selectedItem: 0,
  categoryShown: null
};

//Create context
export const GlobalContext = createContext(initialState);

//Provider Component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  //Actions
  function showCategory(category) {
    dispatch({
      type: "SHOW_CAT",
      payload: category
    });
  }

  function selectItem(itemId) {
    dispatch({
      type: "SEL_ITEM",
      payload: itemId
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        selectedItem: state.selectedItem,
        categoryShown: state.categoryShown,
        selectItem,
        showCategory
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

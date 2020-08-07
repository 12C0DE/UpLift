export default (state, action) => {
  switch (action.type) {
    case "SEL_ITEM":
      return {
        ...state,
        selectedItem: action.payload
      };
    case "SHOW_CAT":
      return {
        ...state,
        categoryShown: action.payload
      };
    default:
      return state;
  }
};

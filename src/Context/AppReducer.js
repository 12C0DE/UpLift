export default (state, action) => {
  switch (action.type) {
    case "EX_DESC":
      return {
        ...state,
        exDescription: action.payload
      };
    case "EX_EQUIP":
      return {
        ...state,
        exEquip: action.payload
      };
    case "EX_NAME":
      return {
        ...state,
        exName: action.payload
      };
    case "MUSCLES":
      return {
        ...state,
        muscles: action.payload
      };
    case "MUSCLES_2ND":
      return {
        ...state,
        muscles2nd: action.payload
      };
    case "IS_LOAD":
      return {
        ...state,
        loading: action.payload
      };
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

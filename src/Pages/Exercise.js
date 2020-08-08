import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../Context/GlobalState";

export const Exercise = () => {
  const {
    exDescription,
    exEquip,
    exName,
    muscles,
    muscles2nd,
    selectedItem
  } = useContext(GlobalContext);
  return (
    <div>
      <h1>Exercise</h1>
      <div>
        <h2>Name: {exName}</h2>
        <h2>Desc: {exDescription}</h2>
        <h2>Equipment: {exEquip}</h2>
        <h2>Muscles: {muscles.map(musc => `${musc}, `)}</h2>
        <h2>2nd Muscles: {muscles2nd.map(musc2 => `${musc2}, `)}</h2>
      </div>
      <Link to="/lifts">Back to Lifts</Link>
    </div>
  );
};

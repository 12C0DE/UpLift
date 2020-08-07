import React, { useContext } from "react";
import NameFetching from "../DataFetch/NameFetching";
import { Link } from "react-router-dom";
import { GlobalContext } from "../Context/GlobalState";

export const Lifts = () => {
  const { categoryShown, selectedItem } = useContext(GlobalContext);

  return (
    <div>
      <h1>Lifts</h1>
      <div>
        <h2>Muscle groups</h2>
        <NameFetching
          url="https://wger.de/api/v2/exercisecategory/?status=2"
          category="exercisecategory"
        />
        {/* {categoryShown === "exercisecategory" ? <p>shown</p> : null} */}
        {categoryShown === "exercisecategory" ? (
          <NameFetching
            url="https://wger.de/api/v2/exercise/?language=2&category="
            selectedItem
          />
        ) : null}
      </div>
      <div>
        <h2>Specific Muscles</h2>
        <NameFetching
          url="https://wger.de/api/v2/muscle/?status=2"
          category="muscle"
        />
        {categoryShown === "muscle" ? <p>shown</p> : null}
      </div>
      <div>
        <h2>Equipment</h2>
        <NameFetching
          url="https://wger.de/api/v2/equipment/?status=2"
          category="equipment"
        />
        {categoryShown === "equipment" ? <p>shown</p> : null}
      </div>
      <Link to="/">Back Home</Link>
    </div>
  );
};

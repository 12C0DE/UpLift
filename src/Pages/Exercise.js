import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../Context/GlobalState";
import { MuscImg } from "../Components/MuscImg";
import muscFront from "../img/muscleFront.svg";
import muscBack from "../img/muscleBack.svg";

export const Exercise = () => {
  let muscFillID = null;
  const [primMusc, setPrimMuscs] = useState([]);
  const [secMuscs, setSecMuscs] = useState([]);
  const [equipName, setEquipName] = useState([]);
  const {
    allEquip,
    exDescription,
    exEquip,
    exName,
    muscles,
    musclesAll,
    muscles2nd,
    musclesBack,
    musclesFront,
    addMusclesBack,
    addMusclesFront
  } = useContext(GlobalContext);

  function updateMuscCount() {
    addMusclesBack(0);
    addMusclesFront(0);
  }

  useEffect(
    () => {
      let intersectionPrims = musclesAll.filter(ones =>
        muscles.includes(ones.muscleId)
      );
      let intersectionSec = musclesAll.filter(twos =>
        muscles2nd.includes(twos.muscleId)
      );

      setPrimMuscs(intersectionPrims);
      setSecMuscs(intersectionSec);

      let intersectionEquip = allEquip.filter(eq => exEquip.includes(eq.id));
      setEquipName(intersectionEquip);
    },
    [] //find a way to include correct dependencies without it running infinitely
  );

  function testHover(e, musc) {
    e.preventDefault();
    alert(musc);
  }

  return (
    <div>
      <h1>Exercise</h1>
      <div>
        <h2>Name: {exName}</h2>
        <h3>Desc: {exDescription}</h3>
        <h3>Equipment: {equipName.map(eq => `${eq.name} `)}</h3>
        <h3>
          Primary Muscles:{" "}
          {primMusc.map(musc => (
            <a
              href=""
              key={`hv_${musc.muscleId}`}
              onClick={e => testHover(e, musc.name)}
            >
              {musc.name}{" "}
            </a>
          ))}
        </h3>
        <h3>Secondary Muscles: {secMuscs.map(musc => `${musc.name} `)}</h3>
      </div>
      <div>
        <button>Add to Workout</button>
      </div>
      <br />
      <div>
        {secMuscs.map(musc2 => (
          <MuscImg
            key={`musc${musc2.muscleId}`}
            muscleId={musc2.muscleId}
            isFrst={false}
            isFront={musc2.is_front}
          />
        ))}
        {primMusc.map(musc => (
          <MuscImg
            key={`musc${musc.muscleId}`}
            muscleId={musc.muscleId}
            isFrst={true}
            isFront={musc.is_front}
          />
        ))}
        {musclesFront > 0 ? (
          <img
            src={muscFront}
            alt="muscFront"
            className="muscFront"
            style={{ zIndex: "1" }}
          />
        ) : null}
        {musclesBack > 0 ? (
          <img
            src={muscBack}
            className="muscBack"
            alt="muscBack"
            style={{ zIndex: "1" }}
          />
        ) : null}
      </div>
      <Link to="/excats" onClick={updateMuscCount}>
        Back to Categories
      </Link>
    </div>
  );
};

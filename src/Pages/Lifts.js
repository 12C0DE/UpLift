import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Firebase/Auth";
import { GlobalContext } from "../Context/GlobalState";
import { AddtoWO } from "../Components/AddtoWO";
import axios from "axios";

export const Lifts = () => {
  const { currentUser } = useContext(AuthContext);
  const [lifts, setLifts] = useState([]);
  const [selLifts, setSelLifts] = useState([]);

  const {
    setExDesc,
    setExEquip,
    setExName,
    setMuscles,
    setMuscles2nd,
    showLiftCb,
    toggleLiftCb
  } = useContext(GlobalContext);

  useEffect(() => {
    axios.get(`/lifts/all/${currentUser.uid}`).then(lifts => {
      setLifts(lifts.data);
      toggleLiftCb(false);
    });
  }, []);

  function setExValues(ex) {
    setExDesc(ex.liftDesc);
    setExEquip(ex.equipment);
    setExName(ex.liftName);
    setMuscles(ex.muscPrim);
    setMuscles2nd(ex.muscSec);
  }

  function toggleLift(e, liftID) {
    e.target.checked
      ? setSelLifts(selLifts => [...selLifts, liftID])
      : setSelLifts(selLifts.filter(lift => lift !== liftID));
  }

  return (
    <div>
      <h1>Your Lifts</h1>
      <br />
      <ul>
        {lifts.map(l => (
          <li key={`li${l._id}`}>
            {showLiftCb ? (
              <input
                type="checkbox"
                checked={selLifts.includes(l._id)}
                onChange={e => toggleLift(e, l._id)}
              />
            ) : null}
            <Link
              key={`l${l._id}`}
              to="/exercise"
              onClick={() => setExValues(l)}
            >
              {l.liftName}
            </Link>
            <span> - {l.liftDesc}</span>
          </li>
        ))}
      </ul>
      <AddtoWO currentUser={currentUser} selLifts={selLifts} />
      <br />
      <Link to="/">Back Home</Link>
    </div>
  );
};

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Firebase/Auth";
import { Link } from "react-router-dom";

export const Programs = () => {
  const { currentUser } = useContext(AuthContext);

  function GetPrograms() {
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
      axios.get(`/programs/all/${currentUser.uid}`).then(progs => {
        setPrograms(progs.data);
      });
    }, []);
    return programs;
  }

  const progs = GetPrograms();

  return (
    <div>
      <h1>Programs</h1>
      <ul>
        {progs.map(prog => (
          <li key={`prog${prog.programID}`}>{prog.programName}</li>
        ))}
      </ul>
      <Link to="/programs">Create A Program</Link>
      <br />
      <Link to="/programs">Update Program</Link>
      <br />
      <Link to="/">Back Home</Link>
    </div>
  );
};

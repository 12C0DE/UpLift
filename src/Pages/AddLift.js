import React from "react";
import { Link } from "react-router-dom";

export const AddLift = () => {
  return (
    <div>
      <h1>Add Lift</h1>
      <form>
        <label>
          Name
          <input type="text" id="name" />
        </label>
      </form>
      <Link to="/">Back Home</Link>
    </div>
  );
};

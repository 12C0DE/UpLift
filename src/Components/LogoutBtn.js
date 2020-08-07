import React from "react";
import Fbase from "../Firebase/base";

export const LogoutBtn = () => {
  return <button onClick={() => Fbase.auth().signOut()}>Sign out</button>;
};

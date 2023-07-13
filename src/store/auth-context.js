import React from "react";

const AuthContext = React.createContext({
  signInStatus: null,
  onSetSignInStatus: (status) => {},
});

export default AuthContext;

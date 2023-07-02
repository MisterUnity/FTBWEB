import React from "react";

const AuthContext = React.createContext({
  signInStatus: null,
  finalRoute: null,
  onSetSignInStatus: (status) => {},
  onViewSwitch: (viewName) => {},
});

export default AuthContext;

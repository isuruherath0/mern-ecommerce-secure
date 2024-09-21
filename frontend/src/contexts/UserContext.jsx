import { createContext, useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (cookies.token) {
      const user = JSON.parse(atob(cookies.token.split(".")[1]));
      setCurrentUser(user);
    }
  }, [cookies.token]);

  const login = (token) => {
    setCookie("token", token, { path: "/" });
    const user = JSON.parse(atob(token.split(".")[1]));
    setCurrentUser(user);
  };

  const logout = () => {
    removeCookie("token", { path: "/" });
    setCurrentUser(null);
  };

  const values = {
    currentUser,
    login,
    logout,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);

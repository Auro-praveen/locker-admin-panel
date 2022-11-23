import { useState, createContext, useContext } from "react";
import { useLogDetails } from "./UserLogDetails";
import PathUrl from '../GlobalVariable/urlPath.json'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  //props will be children

  //in app component wrap the entire component tree with AuthProvider

  const [user, setUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  // const navigate = useNavigate()
  const useLogs = useLogDetails();

  const loginHandler = (user, ...userPermissions) => {
    setUser(user);
    setUserPermissions(...userPermissions[0]);
    console.log("login");
  };

  // const url = "http://192.168.0.198:8080/AuroAutoLocker/FetchUserLoginDetails";
  const logouUser = () => {
    fetch(PathUrl.localServerPath + "FetchUserLoginDetails?userName=" + user, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log("err : " + err));
  };

  const removeLoggedInUSer = (usr) => {
    fetch(PathUrl.localServerPath + "FetchUserLoginDetails?userName=" + usr, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log("err : " + err));
  };

  const logoutHandler = () => {
    const logoutObj = {
      username: user,
      eventType: "logout",
      remarks: "logged out successfully",
    };

    logouUser();
    setUser(null);
    useLogs.storeUserLogs(logoutObj);
    console.log("logout");
    // navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userPermissions,
        loginHandler,
        logoutHandler,
        removeLoggedInUSer
      }}
    >
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

import { createContext, useContext,useEffect, useState } from "react"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [loggedInUsername, setLoggedInUsername] = useState(
    localStorage.getItem("loggedInUsername") || ""
  );
  const [loggedInUserID,setLoggedInUserID]=useState(
    localStorage.getItem("loggedInUserId") || ""
  );
  useEffect(() => {
    const storedUsername = localStorage.getItem("loggedInUsername");
    const storedUserId = localStorage.getItem("loggedInUserId");

    if (storedUsername !== loggedInUsername) {
      setLoggedInUsername(storedUsername || "");
    }

    if (storedUserId !== loggedInUserID) {
      setLoggedInUserID(storedUserId || "");
    }
  }, [loggedInUsername, loggedInUserID]);
  return (
    <UserContext.Provider value={[loggedInUsername, setLoggedInUsername,loggedInUserID,setLoggedInUserID]}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext;
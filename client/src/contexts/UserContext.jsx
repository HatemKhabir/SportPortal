import { createContext, useContext, useState } from "react"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [loggedInUsername, setLoggedInUsername] = useState(
    localStorage.getItem("loggedInUsername") || ""
  );
  const [loggedInUserID,setLoggedInUserID]=useState(
    localStorage.getItem("loggedInUserId") || ""
  );
  
  return (
    <UserContext.Provider value={[loggedInUsername, setLoggedInUsername,loggedInUserID,setLoggedInUserID]}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext;
import { useEffect, useState, useContext } from "react"
import axios from "axios"
import Modal from "../components/Modal"
import { useNavigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"


const FriendsList=()=> {
const {loggedInUsername}=useContext(UserContext);
const [friendsList,setFriendsList]=useState([])

async function getFriendsList(){
  try {
      const response=await axios.get(`http://localhost:8080/api/users/friendsList?username=${loggedInUsername}`,
      {headers:
       {'Content-Type':'application/json',
      },});
      
      console.log(response)
      return response.data;
  } catch (error) {
    console.error('Error fetching friends list:', error);
      return []
  }
}

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getFriendsList();
      console.log("Data received:", data);

      if (data.length > 0) {
        setFriendsList(data);
      } else {
        console.log("No friends received");
      }
    } catch (error) {
      console.error("Error fetching friends list:", error);
      setFriendsList([]);
    }
  };

  fetchData();
}, []);
  return (
    <>
{friendsList.length > 0 ? (
              <div>
                <h2>Friends List  :</h2>
                <ul>
                  {friendsList.map((friend, index) => (
                    <li key={index}>{friend.sender.username?friend.sender.username:friend.recipient.username}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h2>Friends List :</h2>
                <p> You got no friends ! .</p>
              </div>
            )}
    </>
    
  )
}

export default FriendsList
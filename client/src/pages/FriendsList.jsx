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
      
      return response.data;
  } catch (error) {
    console.error('Error fetching friends list:', error);
      return []
  }
}

useEffect(()=>{
  const fetchData=async()=>{
    const data = await getFriendsList();
    setFriendsList(data);
  };
  fetchData()
},[])

  return (
    <>
    <div>{friendsList.map((friend)=>(
      <div key={friend._id}>
        friend._id
      </div>
    ))}</div>
    </>
  )
}

export default FriendsList
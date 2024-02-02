import { useEffect, useState, useContext } from "react"
import axios from "axios"
import Modal from "../components/Modal"
import { useNavigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"


const FriendsList=()=> {

async function getFriendsList(){
    try {
        axios.get("https://localhost:8080/")
        
    } catch (error) {
        return []
    }
}


useEffect(()=>{
async function getFriendsList(){
try{
    axios.get()

}catch(error){
 return[]
}
}
})

  return (
    <>
    <div>friendsList</div>
    </>
  )
}

export default FriendsList
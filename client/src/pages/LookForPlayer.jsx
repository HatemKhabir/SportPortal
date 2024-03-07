import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import React,{useEffect, useState} from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";


function LookForPlayer() {
  const [input,setInput]=useState("");
  const [results,setResults]=useState([]);
  const [showResults,setShowResults]=useState(false);
  const navigate=useNavigate();
  const navigateProfile=(username)=>{
    navigate(`/profile?id=${username}`)
  }
  const fetchData=async (value)=>{
    try {
        const response=await axios.get(`http://localhost:8080/api/users/search-player?q=${value}`,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("authToken")}`
          }
        })
        const data=response.data
        setResults(data)
        setShowResults(data.length>0);
    } catch (error) {
      console.error("mahabech yekhdem")
      console.log(error)
    }
  }
  const handleClick=(value)=>{
    navigateProfile(value)
  }
  const handleChange=(value)=>{
    setInput(value);
    if (value.trim() !== "") {
      fetchData(value);
    } else {
      setResults([]);
    }
}
  return (
    <>
      <h1>Look For Player</h1>

      <div className='search'>
        <input
          type='text'
          className='searchTerm'
          placeholder='Look for a player'
          value={input}
          onChange={(e)=>handleChange(e.target.value)}
        />
        <button
          type='submit'
          className='searchButton'>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size='xl'
            style={{ color: "#ccc" }}
          />
        </button>

        <div className={`search-results ${showResults ? "show-results" : ""}`}>
        {results.map((user,id)=>{
            return <div className="results" key={id} onClick={()=>handleClick(user.username)}>
              {user.username}</div>
            
        })}


        </div>
      </div>
    </>
  )
}

export default LookForPlayer

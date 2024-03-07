import { useEffect, useState, useContext } from "react"
import axios from "axios"
import Modal from "../components/Modal"
import { useNavigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"

const JoinEvent = () => {
  const { loggedInUsername } = useContext(UserContext)

  const [matchID, setMatchID] = useState("")
  //states for the modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [submissions, setSubmissions] = useState([])
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    const matchData = {
      matchID,
      loggedInUsername
    }
    try {
      const response = await axios.post(
        //waiting for the api/signup endpoint to be created
        "http://localhost:8080/api/events/join-event",
        JSON.stringify(matchData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:`Bearer ${localStorage.getItem("authToken")}`

          },
        }
      )
      
      //a page should replace the create event that have players list and the invite code which is the matchID ,
      setModalMessage(response.data)
      setIsModalOpen(true)
    } catch (error) {
      setModalMessage(error)
      setIsModalOpen(true)
    }
  }
  const navigateHome=()=>{
    navigate('/');
  }

  //get all matches in the database to then make them appear as cards ! 
  useEffect(()=>{
    async function fetchData() {
      try {
        const response=await axios.get("http://localhost:8080/api/events/join-event",{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("authToken")}`
          }
        })
        console.log(response.data);
        setSubmissions(response.data);        
      } catch (error) {
       console.log(error);
      }
    }
    fetchData();
  },[]
  )
  const handleDelete = async (index,matchid) => {
    try{
      await axios.delete(`http://localhost:8080/api/events/create-event?matchID=${matchid}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("authToken")}`
        }
      }).
      then((response)=>console.log(response));  
    }catch(error){
      console.log(error);
    }
    const newSubmissions = [...submissions]
    newSubmissions.splice(index, 1)
    setSubmissions(newSubmissions)
  }
  const closeModal = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          EventID:
          <input
            type='text'
            name='event-id'
            value={matchID}
            onChange={(e) => setMatchID(e.target.value)}
          />
        </label>
        <button type='submit'>Join</button>
        <button onClick={navigateHome}>Back</button>

      </form>
      {submissions.map((submission, index) => {
        return (
          <div key={index} className="MatchCardContainer">
          <div key={index} className='match-card'>
            <h2>Event {index + 1}: {submission.eventTitle}</h2>
            <p>Host: {submission.hostUsername}</p>
            <p>Location: {submission.location}</p>
            <p>Date: {submission.date}</p>
            <p>Time: {submission.time}</p>
            <p>MatchId: {submission.matchID}</p>
            <p>Players Number : {submission.playersList.length} / {submission.playersNumber}</p>
            <button onClick={() => handleDelete(index, submission.matchID)}>Delete</button>
            <button onClick={()=>handleClick(index,submission.matchID)}>Submit Results</button>
          </div>
            </div>
        )
      })
     }
      {/* Render the Modal component */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={modalMessage}
      />
    </>
  )
}

export default JoinEvent

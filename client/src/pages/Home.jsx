import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import SocketContext from "../contexts/SocketContext"

const Home = () => {
  const socket=useContext(SocketContext)
 
  return (
    <>
      <Link to='/create-event'>
        <button>Create/Manage Matches</button>
      </Link>
      <Link to='/join-event'>
        <button>Join Match</button>
      </Link>
      <Link to='/search-player'>
        <button>Look for Player</button>
      </Link>
      <Link to='/friends'>
        <button>Friends List</button>
      </Link>
      <Link to='/chats'>
        <button>Chats</button>
      </Link>
    </>
  )
}

export default Home

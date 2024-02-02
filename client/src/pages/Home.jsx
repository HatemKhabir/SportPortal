import { Link } from "react-router-dom"

const Home = () => {
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
    </>
  )
}

export default Home

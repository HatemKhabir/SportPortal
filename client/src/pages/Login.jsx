import { useState, useContext, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { Link } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import UserContext from "../contexts/UserContext" // Import the UserContext hook
import { io } from 'socket.io-client';
const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { from } = location.state || { from: { pathname: "/" } }
  const { setIsAuthenticated } = useContext(AuthContext)
  const [loggedInUsername, setLoggedInUsername] = useContext(UserContext);

  //this logic runs when the component mounts (i.e., when it is initially rendered) and whenever any of the dependencies (setIsAuthenticated, navigate, or from) change
  useEffect(() => {
    async function fetch(){
    // Check if the user is already authenticated
    const authToken = localStorage.getItem("authToken")
    if (authToken) {
      setIsAuthenticated(true)
      navigate(from)
    }
  }
  fetch();
}, [setIsAuthenticated, navigate, from])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const userData = {
      username,
      password,
    }
    try {
      const response = await axios.post(
        //auth/login ??
        "http://localhost:8080/auth/login",
        JSON.stringify(userData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      // Handle the response here
      if (response.status === 200) {
        //store the user token in localStorage
       localStorage.setItem("authToken", response.data.token);
       setIsAuthenticated(true)
        // Set the logged-in username here
        setLoggedInUsername(username)
        localStorage.setItem("loggedInUsername", username);
        localStorage.setItem("loggedInUserId",response.data.player._id)
        navigate(from)
        console.log(response.data)
      }
    } catch (error) {
      //handle errors here
      console.log(error)
      setError(error.response.data.msg)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type='text'
            name='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type='submit'>Login</button>
        {error && <p className='error-msg'>{error}</p>}
      </form>
      <div>
        <p> Don&apos;t have an account?</p>
        <Link to='/signup'>
          <button>Sign Up</button>
        </Link>
      </div>
    </>
  )
}

export default Login

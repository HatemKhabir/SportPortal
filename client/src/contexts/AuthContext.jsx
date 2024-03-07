import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      setIsAuthenticated(false)
    }
  }, [])

  const handleLogin = (authToken) => {
    localStorage.setItem("authToken", authToken)
    setIsAuthenticated(true)
  }

  //TODO to Be implemented for the logout
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setIsAuthenticated(false)
    // Redirect to the login page
    navigate("/login")
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

import { Routes, Route } from "react-router-dom"

import { Home, SignUp, Login, CreateEvent, JoinEvent, LookForPlayer,PlayerProfile, FriendsList, ChatPage } from "./pages"
import Header from "./components/Header"

import { AuthProvider } from "./contexts/AuthContext"
import { UserProvider } from "./contexts/UserContext"

import ProtectedRoute from "./routes/ProtectedRoute"
import { SocketProvider } from "./contexts/SocketContext"

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Header/>
        <main>
          <Routes>
            <Route
              path='/'
              element={<ProtectedRoute component={Home} />}
              />
            <Route
              path='/signup'
              element={<SignUp />}
              />
            <Route
              path='/login'
              element={<Login />}
              />
            <Route
              path='/create-event'
              element={<ProtectedRoute component={CreateEvent} />}
              />
            <Route
              path='/join-event'
              element={<ProtectedRoute component={JoinEvent} />}
              />
            <Route
              path='/search-player'
              element={<ProtectedRoute component={LookForPlayer} />}
              />
            <Route 
            path='/profile'
            element={<ProtectedRoute component={PlayerProfile} />}>
            </Route>
            <Route
            path="/friends"
            element={<ProtectedRoute component={FriendsList} />}> 
            </Route>
            <Route
            path="/chats"
            element={<ProtectedRoute component={ChatPage} />}> 
            </Route>
          </Routes>
        
        </main>
      </UserProvider>
    </AuthProvider>
  
  )
}

export default App

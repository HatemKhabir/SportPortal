import { Routes, Route } from "react-router-dom"

import { Home, SignUp, Login, CreateEvent, JoinEvent, LookForPlayer } from "./pages"
import Header from "./components/Header"

import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./routes/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <Header />
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
            element={<CreateEvent />}
          />
          <Route
            path='/join-event'
            element={<JoinEvent />}
          />
          <Route
            path='/look-forPlayer'
            element={<LookForPlayer />}
          />
        </Routes>
      </main>
    </AuthProvider>
  )
}

export default App

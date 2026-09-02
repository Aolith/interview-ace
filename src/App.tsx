import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useUserStore } from "./store/useUserStore"
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Practice from './pages/Practice'
import Navbar from './components/layout/Navbar'
import Welcome from './pages/Welcome'
import Questions from './pages/Questions'

function App() {
  //获取当前用户信息
  const fetchUser = useUserStore((state) => state.fetchUser)
  useEffect(() => {
    fetchUser()
  }, [])
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/questions" element={<ProtectedRoute><Questions /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App

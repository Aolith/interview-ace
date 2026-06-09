import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useUserStore } from "../src/store/useUserStore"
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Practice from './pages/Practice'
import Navbar from './components/layout/Navbar'
import Welcome from './pages/Welcome'

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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </Router>
  )
}

export default App

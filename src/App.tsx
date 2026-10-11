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
import QuestionDetail from './pages/Questiondetal'
import PracticeQuiz from './pages/PracticeQuiz'
import Favorites from './pages/Favorites'
import Review from './pages/Review'
import WrongQuiz from './pages/WrongQuiz'

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
        <Route path="/questions/:id" element={<ProtectedRoute><QuestionDetail /></ProtectedRoute>} />
        <Route path="/practice-quiz" element={<ProtectedRoute><PracticeQuiz /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
        <Route path="/review/quiz" element={<ProtectedRoute><WrongQuiz /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App

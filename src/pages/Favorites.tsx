import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Favorites: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('/api/questions/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setQuestions(res.data.questions)
      } catch (error) {
        console.error('获取收藏失败', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">我的收藏</h2>

          {loading ? (
            <p className="text-gray-500 text-center py-8">加载中...</p>
          ) : questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">还没有收藏题目，去练习页看看吧</p>
          ) : (
            <div className="space-y-3">
              {questions.map((q) => (
                <Link
                  key={q._id}
                  to={`/questions/${q._id}`}
                  className="block bg-white rounded-lg border border-gray-200 hover:border-indigo-300 p-4 transition"
                >
                  <h3 className="font-medium text-gray-800">{q.question}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                      {q.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {q.difficulty === 'easy' ? '简单' : q.difficulty === 'medium' ? '中等' : '困难'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Favorites
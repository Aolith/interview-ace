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
          {/* 标题 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">我的收藏</h2>
              <p className="text-sm text-gray-500">共 {questions.length} 道题目</p>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-12">加载中...</p>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">还没有收藏题目</p>
              <Link
                to="/practice-quiz"
                className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                去练习看看
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {questions.map((q) => (
                <Link
                  key={q._id}
                  to={`/questions/${q._id}`}
                  className="bg-white rounded-xl shadow hover:shadow-xl hover:-translate-y-0.5 border border-gray-100 p-5 transition duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    {/* 左侧图标圈 */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition duration-300">
                      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>

                    {/* 右侧内容 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 group-hover:text-indigo-600 transition line-clamp-2 mb-2">
                        {q.question}
                      </h3>
                      <div className="flex gap-2">
                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                          {q.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${q.difficulty === 'easy' ? 'bg-green-50 text-green-600' :
                            q.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                              'bg-red-50 text-red-600'
                          }`}>
                          {q.difficulty === 'easy' ? '简单' : q.difficulty === 'medium' ? '中等' : '困难'}
                        </span>
                        <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded">
                          {q.type === 'single' ? '选择题' : '简答题'}
                        </span>
                      </div>
                    </div>

                    {/* 右侧箭头 */}
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition flex-shrink-0 mt-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
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
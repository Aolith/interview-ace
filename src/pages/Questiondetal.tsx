import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const QuestionDetail: React.FC = () => {
  const [question, setQuestion] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        // 并行请求：题目详情 + 收藏列表
        const [questionRes, favoritesRes] = await Promise.all([
          axios.get(`/api/questions/${id}`, { headers }),
          axios.get('/api/questions/favorites', { headers })
        ])

        setQuestion(questionRes.data.question)

        // 判断当前题是否在收藏列表里
        const favoriteIds = favoritesRes.data.questions.map((q: any) => q._id)
        setIsFavorite(favoriteIds.includes(id))
      } catch (error) {
        console.error('Error fetching question:', error)
      }
    }
    fetchData()
  }, [id])

  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        `/api/questions/${id}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setIsFavorite(res.data.isFavorite)
    } catch (error: any) {
      alert(error.response?.data?.message || '操作失败')
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100">
      <div className="max-w-4xl mx-auto p-4">
        {question ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* 顶部信息栏 */}
            <div className="bg-indigo-50 px-6 py-4 flex items-center gap-3 border-b border-indigo-100">
              <span className="text-xs font-medium bg-indigo-500 text-white px-3 py-1 rounded-full">
                {question.category}
              </span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                }`}>
                {question.difficulty === 'easy' ? '简单' : question.difficulty === 'medium' ? '中等' : '困难'}
              </span>

              {/* 收藏按钮 */}
              <button
                onClick={handleFavorite}
                className={`ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${isFavorite
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-white text-gray-500 hover:bg-gray-100'
                  }`}
              >
                {isFavorite ? '★ 已收藏' : '☆ 收藏'}
              </button>
            </div>

            {/* 题目内容 */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 leading-relaxed mb-6">
                {question.question}
              </h2>

              {question.type === 'single' && (
                <div className="space-y-3 mb-6">
                  {question.options.map((option: string, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition ${option === question.correctAnswer
                          ? 'bg-green-50 border-green-300'
                          : 'bg-white border-gray-200'
                        }`}
                    >
                      <span className="font-medium text-gray-500 mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className={option === question.correctAnswer ? 'font-medium text-green-700' : 'text-gray-700'}>
                        {option}
                      </span>
                      {option === question.correctAnswer && (
                        <span className="ml-2 text-xs font-medium text-green-600">✓ 正确答案</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">正确答案</h3>
                <div className="bg-green-50 rounded-lg p-4 text-green-800 font-medium">
                  {question.correctAnswer}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">解析</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 leading-relaxed">
                  {question.explanation}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
            问题未找到
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionDetail
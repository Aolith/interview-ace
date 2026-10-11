import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Review: React.FC = () => {
  const [singleCount, setSingleCount] = useState(0)
  const [textCount, setTextCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }
        const [singleRes, textRes] = await Promise.all([
          axios.get('/api/questions/wrong?type=single', { headers }),
          axios.get('/api/questions/wrong?type=text', { headers })
        ])
        setSingleCount(singleRes.data.count)
        setTextCount(textRes.data.count)
      } catch (error) {
        console.error('获取错题统计失败', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const handleEnter = (type: string, count: number) => {
    if (count === 0) return
    navigate(`/review/quiz?type=${type}`)
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100 flex items-start justify-center">
      <div className="max-w-3xl w-full mx-4 mt-10 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">复盘回顾</h2>
        <p className="text-gray-500 mb-8">针对做错的题目，重新巩固一遍</p>

        {loading ? (
          <p className="text-gray-500 text-center py-12">加载中...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 选择题错题 */}
            <div
              onClick={() => handleEnter('single', singleCount)}
              className={`bg-white rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 p-8 flex flex-col items-center justify-center min-h-[210px] transition duration-300 group relative overflow-hidden ${singleCount === 0 ? 'opacity-50 cursor-not-allowed hover:shadow-none hover:translate-y-0' : 'cursor-pointer'
                }`}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition">
                选择题错题
              </h2>
              <p className="text-3xl font-bold text-indigo-600 mb-1">{singleCount}</p>
              <p className="text-gray-500 text-sm">道题目待巩固</p>
            </div>

            {/* 简答题错题 */}
            <div
              onClick={() => handleEnter('text', textCount)}
              className={`bg-white rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 p-8 flex flex-col items-center justify-center min-h-[210px] transition duration-300 group relative overflow-hidden ${textCount === 0 ? 'opacity-50 cursor-not-allowed hover:shadow-none hover:translate-y-0' : 'cursor-pointer'
                }`}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                <svg className="w-7 h-7 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-violet-600 transition">
                简答题错题
              </h2>
              <p className="text-3xl font-bold text-violet-600 mb-1">{textCount}</p>
              <p className="text-gray-500 text-sm">道题目待巩固</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Review
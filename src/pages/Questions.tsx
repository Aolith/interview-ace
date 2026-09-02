import React from "react"
import { useState, useEffect } from 'react'
import axios from 'axios'
const Questions: React.FC = () => {
  // 分类列表
  const categories = ["HTML/CSS", "JavaScript", "React", "Vue", "网络与浏览器", "工程化"]
  // 题目列表
  const [questions, setQuestions] = useState<any[]>([])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/questions', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setQuestions(response.data.questions)
      } catch (error) {
        console.error('Error fetching questions:', error)
      }
    }

    fetchQuestions()
  }, [])

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100">
      <div className="max-w-6xl mx-auto flex bg-white rounded-xl shadow-lg overflow-hidden">
        {/* 左侧分类栏 */}
        <div className="w-64 border-r border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">题目分类</h2>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className="text-left px-3 py-2 rounded hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 右侧题目列表 */}
        <div className="flex-1 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">题目列表</h2>
          {/* 用 map 渲染题目卡片 */}
          {questions.map((q) => (
            <div key={q._id} className="bg-white rounded-lg shadow p-4 cursor-pointer">
              <h3 className="font-medium text-gray-800">{q.question}</h3>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">{q.category}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{q.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Questions
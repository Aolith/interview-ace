import React from 'react'
import { Link } from 'react-router-dom'
const Practice: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-400 via-indigo-200 to-violet-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">

        {/* AI 模拟面试 - 占满整行，视觉更突出 */}
        <Link to="/interview" className="md:col-span-3 bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center min-h-[260px] hover:shadow-2xl hover:-translate-y-1 transition ">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">AI 模拟面试</h2>
          <p className="text-gray-500 mb-6 text-center">上传简历和 JD，体验真实面试场景</p>
        </Link>

        {/* 基础练习 */}
        <Link to="/practice-quiz" className="bg-white rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 p-8 flex flex-col items-center justify-center min-h-[210px] transition duration-300 group relative overflow-hidden">
          {/* 图标 */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
            <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition">基础练习</h2>
          <p className="text-gray-500 text-center mb-4">海量真题，巩固基础</p>
          {/* 小标签 */}
          <div className="flex gap-2">
            <span className="text-xs bg-sky-50 text-sky-600 px-2 py-1 rounded">选择题</span>
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">简答题</span>
          </div>
        </Link>

        {/* 题目收藏 */}
        <Link to="/collection" className="bg-white rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 p-8 flex flex-col items-center justify-center min-h-[210px] transition duration-300 group">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">我的收藏</h2>
          <p className="text-gray-500 mb-6 text-center">回顾收藏的经典题目</p>
        </Link>

        {/* 学习计划 */}
        <Link to="/plan" className="bg-white rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 p-8 flex flex-col items-center justify-center min-h-[210px] transition duration-300 group">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">学习计划</h2>
          <p className="text-gray-500 mb-6 text-center">制定个性化的刷题计划</p>
        </Link>

      </div>
    </div>
  )
}

export default Practice
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
        <Link to="/basic" className="bg-white rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 p-8 flex flex-col items-center justify-center min-h-[210px] transition duration-300 group">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">基础练习</h2>
          <p className="text-gray-500 mb-6 text-center">海量真题，巩固基础</p>
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
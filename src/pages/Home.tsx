import React from 'react'
import { BarChart3, FileText, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'

const Home: React.FC = () => {
  const user = useUserStore((state) => state.user)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-300 via-blue-300 to-white p-4">
      <div className="max-w-2xl w-full">
        <div>
          {/* 问候语 */}
          <h1 className="text-3xl font-bold text-indigo-50 mb-8">
            你好，<span className="font-bold text-indigo-500">{user?.username || 'Candidate'}</span>
          </h1>

          {/* 进度面板 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="text-blue-500 w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-800">学习进度</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-indigo-600">0</p>
                <p className="text-sm text-gray-500">今日已刷</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-600">0</p>
                <p className="text-sm text-gray-500">累计刷题</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-600">0</p>
                <p className="text-sm text-gray-500">最近面试次数</p>
              </div>
            </div>
          </div>

          {/* 快捷入口 */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/questions"
              className="bg-white rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 p-6 transition duration-300 group"
            >
              <FileText className="text-blue-500 mb-2" />
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition">
                进入题库
              </h3>
              <p className="text-sm text-gray-500 mt-1">基础练习 & 八股文</p>
            </Link>

            <Link
              to="/progress"
              className="bg-white rounded-xl shadow hover:shadow-2xl hover:-translate-y-1 p-6 transition duration-300 group"
            >
              <TrendingUp className="text-blue-500 mb-2" />
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition">
                复盘回顾
              </h3>
              <p className="text-sm text-gray-500 mt-1">错题回顾 & 成长记录</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
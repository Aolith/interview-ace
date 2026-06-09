import React from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

const Welcome: React.FC = () => {
  const isLogin = useUserStore((state) => state.isLogin);
  const user = useUserStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600  via-blue-300 to-violet-400 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">

        {/* Logo 或图标占位 */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-indigo-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg">
            IA
          </div>
        </div>

        {/* 主标题 */}
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          面试克星
        </h1>

        {/* 副标题 */}
        <p className="text-xl text-gray-600 mb-8">
          AI 驱动的智能面试准备平台
        </p>

        {/* 根据登录状态显示不同内容 */}
        {isLogin ? (
          // 已登录状态
          <div>
            <p className="text-lg text-gray-700 mb-8">
              欢迎回来，<span className="font-bold text-indigo-600">{user?.username || 'Candidate'}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/practice"
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
              >
                开始练习
              </Link>
              <Link
                to="/profile"
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 px-8 rounded-lg transition duration-300"
              >
                个人主页
              </Link>
            </div>
          </div>
        ) : (
          // 未登录状态
          <div>
            <p className="text-lg text-gray-600 mb-8">
              丰富的题库、AI 模拟面试、个性化学习路径，助你轻松应对各种面试挑战
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
              >
                立即注册
              </Link>
              <Link
                to="/login"
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 px-8 rounded-lg transition duration-300"
              >
                登录
              </Link>
            </div>
          </div>
        )}

        {/* 功能亮点 */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-bold text-gray-900 mb-1">丰富题库</h3>
            <p className="text-sm text-gray-500">覆盖前端、后端、算法等多方向面试题</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-bold text-gray-900 mb-1">AI 模拟面试</h3>
            <p className="text-sm text-gray-500">AI 面试官实时追问，还原真实面试场景</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-3xl mb-2">📈</div>
            <h3 className="font-bold text-gray-900 mb-1">进度追踪</h3>
            <p className="text-sm text-gray-500">打卡记录、学习复盘，见证每一步成长</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Welcome;
import React from 'react';
import { useUserStore } from "../store/useUserStore"
import { useNavigate } from 'react-router-dom'

const Profile: React.FC = () => {
  const user = useUserStore(state => state.user)

  //获取当前用户信息

  //退出登录
  const loginOut = useUserStore((state) => state.loginOut)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-start justify-center pt-10 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url('/profile-bg.jpg')` }}>
      <div className="bg-white backdrop-blur-sm rounded-xl shadow-lg max-w-2xl w-full mx-4 p-8 relative z-10">
        {/* 信息展示区域 */}
        <div className="space-y-4 mb-8">
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-gray-500">用户名:</dt>
            <dd className="text-gray-900 mt-1">{user?.username || 'candidate'}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-gray-500">邮箱:</dt>
            <dd className="text-gray-900 mt-1">{user?.email || ''}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-gray-500">性别:</dt>
            <dd className="text-gray-900 mt-1">{user?.sex || '未知'}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-gray-500">年龄:</dt>
            <dd className="text-gray-900 mt-1">{user?.age || '保密'}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-gray-500">最高学历:</dt>
            <dd className="text-gray-900 mt-1">{user?.degree || '未设置'}</dd>
          </div>
          {/* 上传简历：做成文字链接 */}
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-gray-500 w-20 shrink-0">简历:</dt>
            <dd className="text-indigo-500 hover:text-blue-600 cursor-pointer transition duration-300">点击上传</dd>
          </div>
        </div>
        {/* 按钮区域 */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button className="border border-gray-300 text-gray-600 hover:bg-blue-400 font-bold py-2 px-6 rounded-lg transition duration-300">切换主题</button>
          <button className="border border-gray-300 text-gray-600 hover:bg-red-400 font-bold py-2 px-6 rounded-lg transition duration-300" onClick={() => { loginOut(); navigate('/login') }}>退出登录</button>
        </div>
      </div >
    </div >
  )
}

export default Profile
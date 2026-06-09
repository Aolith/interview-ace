import React, { useState } from 'react'
import { useUserStore } from "../store/useUserStore"
import { useNavigate } from 'react-router-dom'

const Profile: React.FC = () => {
  const user = useUserStore(state => state.user)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const updateUser = useUserStore((state) => state.updateUser)


  //退出登录
  const loginOut = useUserStore((state) => state.loginOut)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-start justify-center pt-10 bg-gradient-to-b  from-indigo-600  via-blue-300 to-violet-400">
      <div className="bg-white backdrop-blur-sm rounded-xl shadow-lg max-w-2xl w-full mx-4 p-8 relative">
        {/* 信息展示区域 */}
        <div className="space-y-4 mb-8">
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-gray-500">用户名:</dt>
            {editingField !== 'username' ? (
              <dd
                className="text-gray-900 mt-1 cursor-pointer hover:bg-gray-100 rounded px-1 transition"
                onClick={() => {
                  setEditingField('username')
                  setEditValue(user?.username || '')
                }}
              >
                {user?.username || 'candidate'}
              </dd>
            ) : (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={async () => {
                  try {
                    await updateUser({ username: editValue });
                    setEditingField(null);
                  } catch (error) {
                    alert('更新失败，请重试');
                  }
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    try {
                      await updateUser({ username: editValue });
                      setEditingField(null);
                    } catch (error) {
                      alert('更新失败，请重试');
                    }
                  }
                }}
                className="border border-gray-300 rounded px-2 py-1 w-40 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                autoFocus
              />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-gray-500">邮箱:</dt>
            <dd className="text-gray-900 mt-1">{user?.email || ''}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-gray-500">性别:</dt>
            {editingField !== 'sex' ? (
              <dd
                className="text-gray-900 mt-1 cursor-pointer hover:bg-gray-100 rounded px-1 transition"
                onClick={() => {
                  setEditingField('sex')
                  setEditValue(user?.sex || '未知')
                }}
              >
                {user?.sex || '未知'}
              </dd>
            ) : (
              <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={async () => {
                  try {
                    await updateUser({ sex: editValue });
                    setEditingField(null);
                  } catch (error) {
                    alert('更新失败，请重试');
                  }
                }}
                className="border border-gray-300 rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-indigo-300 ml-2"
                autoFocus
              >
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="未知">未知</option>
              </select>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-gray-500">年龄:</dt>
            {editingField !== 'age' ? (
              <dd
                className="text-gray-900 mt-1 cursor-pointer hover:bg-gray-100 rounded px-1 transition"
                onClick={() => {
                  setEditingField('age');
                  setEditValue(String(user?.age || ''));
                }}
              >
                {user?.age || '未设置'}
              </dd>
            ) : (
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={async () => {
                  try {
                    if (editValue === '') {
                      setEditingField(null)
                      return
                    }
                    await updateUser({ age: Number(editValue) });
                    setEditingField(null);
                  } catch (error) {
                    alert('更新失败，请重试');
                  }
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    try {
                      if (editValue === '') {
                        setEditingField(null)
                        return
                      }
                      await updateUser({ age: Number(editValue) });
                      setEditingField(null);
                    } catch (error) {
                      alert('更新失败，请重试');
                    }
                  }
                }}
                className="border border-gray-300 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-300 ml-2"
                autoFocus
              />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-gray-500">最高学历:</dt>
            {editingField !== 'degree' ? (
              <dd
                className="text-gray-900 mt-1 cursor-pointer hover:bg-gray-100 rounded px-1 transition"
                onClick={() => {
                  setEditingField('degree')
                  setEditValue(user?.degree || '未设置')
                }}
              >
                {user?.degree || '未设置'}
              </dd>
            ) : (
              <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={async () => {
                  try {
                    await updateUser({ degree: editValue });
                    setEditingField(null);
                  } catch (error) {
                    alert('更新失败，请重试');
                  }
                }}
                className="border border-gray-300 rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-indigo-300 ml-2"
                autoFocus
              >
                <option value="保密">保密</option>
                <option value="高中">高中</option>
                <option value="大专">大专</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
            )}
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
          <button className="border border-gray-300 text-gray-600 hover:bg-red-400 font-bold py-2 px-6 rounded-lg transition duration-300" onClick={() => { loginOut(); navigate('/welcome') }}>退出登录</button>
        </div>
      </div >
    </div >
  )
}

export default Profile
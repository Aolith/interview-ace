import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "../store/useUserStore"
const Login: React.FC = () => {
  // 使用 useState 来管理输入框的值
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const login = useUserStore((state) => state.login)
  const navigate = useNavigate()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  // 处理表单提交
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate("/")
    } catch (error: any) {
      const message = error.response?.data?.message || "登录失败，请检查邮箱和密码是否正确"
      alert(message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600  via-blue-300 to-violet-400">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-violet-300 mb-6">面试克星登录</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">邮箱号:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
              placeholder="请输入邮箱号"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">密码:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
              placeholder="请输入密码"
            />
          </div>
          <div className="mt-6 flex justify-center">
            <button type="submit" className="bg-indigo-500 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded w-40 h-15 ">
              登录
            </button>
          </div>
        </form>
        {/* 添加注册链接 */}
        <p className="mt-4 text-center text-gray-600">
          还没有账号？<Link to="/register" className="text-indigo-500 hover:text-indigo-700">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
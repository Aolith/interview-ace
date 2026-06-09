import React, { useState } from "react"
import { Link } from "react-router-dom"
const Login: React.FC = () => {
  // 使用 useState 来管理输入框的值
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })
      if (res.ok) {
        alert("登录成功！")
        // 可以在这里进行页面跳转或者其他操作
      } else {
        alert("登录失败，请检查用户名和密码。")
      }
      //之后在这里处理登录成功后的逻辑，比如存储用户信息等
    } catch (error) {
      console.error("登录失败:", error)
      alert("登录失败，请检查网络连接或稍后再试。")
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
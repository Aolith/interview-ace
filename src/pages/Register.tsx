import React, { useState } from 'react'
import { Link } from 'react-router-dom'
const Register: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [captcha, setCaptcha] = useState('')

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, confirmPassword, captcha })
      })
      if (res.ok) {
        alert("注册成功！")
        // 可以在这里进行页面跳转或者其他操作
      } else {
        alert("注册失败，请检查输入信息。")
      }
    } catch (error) {
      console.error("注册失败:", error)
      alert("注册失败，请检查网络连接或稍后再试。")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600  via-blue-300 to-violet-400">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-violet-300 mb-6">面试克星注册</h2>
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
          <div className="mt-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">确认密码:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
              placeholder="请再次输入密码"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="captcha" className="block text-gray-700 text-sm font-bold mb-2">验证码:</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="captcha"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="border border-gray-300 rounded-md flex-1 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                placeholder="请输入验证码"
              />
              {/* 发送验证码按钮 */}
              <button type="button" className="bg-gray-400 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded whitespace-nowrap">
                发送验证码
              </button>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button type="submit" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-40 h-15 ">
              注册
            </button>
          </div>
        </form>
        {/* 添加登录链接 */}
        <p className="mt-4 text-center text-gray-600">
          已有账号？<Link to="/login" className="text-indigo-500 hover:text-indigo-700">
            立即登录
          </Link>
        </p>
      </div>
    </div >
  )
}

export default Register
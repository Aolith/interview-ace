import React from 'react'
import { Navigate } from 'react-router-dom'
import useUserStore from '../store/useUserStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useUserStore((state) => state.user)
  const isLogin = useUserStore((state) => state.isLogin)

  // 双重检查：确保登录状态和用户信息都存在
  if (!isLogin || !user) {
    return <Navigate to="/welcome" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
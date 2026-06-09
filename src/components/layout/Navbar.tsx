import { NavLink } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <nav className="bg-indigo-800 text-white p-4">
      <ul className="flex gap-6">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-white font-bold' : 'text-indigo-200 hover:text-white')}>首页</NavLink>
        </li>
        <li>
          <NavLink to="/practice" className={({ isActive }) => (isActive ? 'text-white font-bold' : 'text-indigo-200 hover:text-white')}>练习</NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'text-white font-bold' : 'text-indigo-200 hover:text-white')}>个人主页</NavLink>
        </li>
        <li>
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'text-white font-bold' : 'text-indigo-200 hover:text-white')}>登录</NavLink>
        </li>
        <li>
          <NavLink to="/register" className={({ isActive }) => (isActive ? 'text-white font-bold' : 'text-indigo-200 hover:text-white')}>注册</NavLink>
        </li>
        <li>
          <NavLink to="/welcome" className={({ isActive }) => (isActive ? 'text-white font-bold' : 'text-indigo-200 hover:text-white')}>欢迎页</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
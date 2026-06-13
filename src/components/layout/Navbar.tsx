import { NavLink } from 'react-router-dom'
import { useUserStore } from '../../store/useUserStore'

const Navbar: React.FC = () => {
  const isLogin = useUserStore((state) => state.isLogin)

  return (
    <nav className="bg-gradient-to-r from-indigo-400 via-sky-300 to-violet-300 p-4 relative flex items-center">
      <div className="flex-none">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="bg-indigo-500 text-white font-bold px-2 py-1 rounded-lg text-lg">IA</span>
          <span className="font-bold text-white text-lg tracking-wide">面试克星</span>
        </NavLink>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <ul className="flex gap-10 items-center">
          {isLogin ? (
            <>
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? 'text-white text-lg' : 'text-indigo-800 text-lg hover:text-white'}>首页</NavLink>
              </li>
              <li>
                <NavLink to="/practice" className={({ isActive }) => isActive ? 'text-white text-lg' : 'text-indigo-800 text-lg hover:text-white'}>练习</NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'text-white text-lg' : 'text-indigo-800 text-lg hover:text-white'}>个人主页</NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/welcome" className={({ isActive }) => isActive ? 'text-white text-lg' : 'text-indigo-800 text-lg hover:text-white'}>欢迎页</NavLink>
              </li>
              <li>
                <NavLink to="/login" className={({ isActive }) => isActive ? 'text-white text-lg' : 'text-indigo-800 text-lg hover:text-white'}>登录</NavLink>
              </li>
              <li>
                <NavLink to="/register" className={({ isActive }) => isActive ? 'text-white text-lg' : 'text-indigo-800 text-lg hover:text-white'}>注册</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
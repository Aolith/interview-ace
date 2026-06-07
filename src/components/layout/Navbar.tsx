import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul className="flex gap-6">
        <li>
          <Link to="/">首页</Link>
        </li>
        <li>
          <Link to="/practice">练习</Link>
        </li>
        <li>
          <Link to="/profile">个人主页</Link>
        </li>
        <li>
          <Link to="/login">登录</Link>
        </li>
        <li>
          <Link to="/register">注册</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
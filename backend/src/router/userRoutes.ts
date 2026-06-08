import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User'

const userRoutes = express.Router()

//用户注册
userRoutes.post('/register', async (req, res) => {
  try {
    const { password, email } = req.body
    // 非空检查
    if (!password || !email) {
      return res.status(400).json({ message: '邮箱和密码不能为空' })
    }
    //唯一性检查
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: '邮箱已被使用' })
    }
    //邮箱格式检查
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' })
    }
    //密码格式检查
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(password)) {
      return res.status(400).json({ error: '密码必须包含字母和数字,长度8-16位' })
    }
    //密码加密
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    //构造新的用户
    const newUser = await User.create({
      email: req.body.email,
      password: hashedPassword
    })
    console.log('新用户添加成功:', email)
    const { password: _, ...safeUser } = newUser.toObject()
    res.status(201).json({ user: safeUser })
  } catch (error) {
    console.log('注册失败', error)
    res.status(500).json({ message: '服务器内部错误' })
  }
})

//用户登录
userRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    //非空检查
    if (!email || !password) {
      return res.status(400).json({ message: '邮箱和密码不能为空' })
    }
    //查找用户
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(400).json({ message: '用户不存在' })
    }
    //密码验证
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: '密码错误' })
    }
    //登录成功
    console.log('用户登录成功:', email)
    const { password: _, ...safeUser } = user.toObject()
    res.json({ user: safeUser })
  } catch (error) {
    console.log('登录失败', error)
    res.status(500).json({ message: '服务器内部错误' })
  }
})

export default userRoutes
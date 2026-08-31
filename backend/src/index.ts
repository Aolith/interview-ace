import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './config/db'
import path from 'path'

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

// 挂载路由
import userRoutes from './router/userRoutes'
app.use('/api/users', userRoutes)

import uploadRoutes from './router/uploadRoutes'
app.use('/api/upload', uploadRoutes)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))// 配置静态文件访问，让前端能访问上传的文件

import aiRoutes from './router/aiRoutes'
app.use('/api/ai', aiRoutes)

export default app

const PORT = Number(process.env.PORT) || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})

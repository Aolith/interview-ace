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

export default app

app.listen(process.env.PORT, () => {
  console.log(`服务器启动成功，端口号：${process.env.PORT}`)
})


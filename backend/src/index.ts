import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './config/db'

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

// 挂载路由
import userRoutes from './router/userRoutes'
app.use('/api/users', userRoutes)

export default app

app.listen(process.env.PORT, () => {
  console.log(`服务器启动成功，端口号：${process.env.PORT}`)
})


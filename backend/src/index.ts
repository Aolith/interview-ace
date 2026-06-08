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


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
//引入依赖
import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose"
import path from "path"
import fs from "fs"
import connectDB from "./config/db"
import Question from "./models/Question"


const filePath = path.join(__dirname, "data", "questions.seed.json")

//读取JSON文件
const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))

//将数据循环插入到数据库中
const seedData = async () => {
  try {
    //连接数据库
    await connectDB()
    await Question.deleteMany({})
    await Question.insertMany(data)
    console.log("数据插入成功")
  } catch (error) {
    console.error("数据插入失败", error)
  } finally {
    //关闭数据库连接
    mongoose.disconnect()
  }
}

seedData()
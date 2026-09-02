import express from "express"
import authMiddleware, { AuthRequest } from "../middlewares/auth"
import Question from "../models/Question"
import { count } from "node:console"

const questionRoutes = express.Router()

// 获取所有符合标准的问题（按分类和难度筛选来获取）
questionRoutes.get("/", authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const { category, difficulty } = req.query;
    const filter: any = {}
    if (category) filter.category = category
    if (difficulty) filter.difficulty = difficulty
    const questions = await Question.find(filter)
    res.json({ questions, count: questions.length })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "获取问题列表失败" })
  }
})

export default questionRoutes
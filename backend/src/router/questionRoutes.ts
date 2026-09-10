import express from "express"
import authMiddleware, { AuthRequest } from "../middlewares/auth"
import Question from "../models/Question"
import AnswerRecord from "../models/AnswerRecord"

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

//抽取题目
questionRoutes.get("/practice", authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const { category, difficulty, count, type } = req.query
    const limit = Math.min(parseInt(count as string) || 10, 10)
    const filter: any = {}
    if (category) filter.category = category
    if (difficulty) filter.difficulty = difficulty
    if (type) filter.type = type
    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: limit } },
      {
        $project: {
          correctAnswer: 0,
          explanation: 0,
          __v: 0,
          createdAt: 0,
          updatedAt: 0
        }
      }
    ])
    if (questions.length === 0) {
      return res.status(404).json({ message: "没有符合条件的题目" })
    }
    res.json({ questions })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "抽取题目失败" })
  }
})

// 获取单个问题的详细信息
questionRoutes.get("/:id", authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const question = await Question.findById(req.params.id)
    if (!question) {
      return res.status(404).json({ message: "问题未找到" })
    }
    res.json({ question })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "获取问题详情失败" })
  }
})

//提交答案接口
questionRoutes.post("/:id/answer", authMiddleware, async (req: AuthRequest, res: express.Response) => {
  try {
    const { answer } = req.body
    const question = await Question.findById(req.params.id)
    if (!question) {
      return res.status(404).json({ message: "问题未找到" })
    }
    const isCorrect = question.correctAnswer.trim() === answer.trim()
    const answerRecord = await AnswerRecord.findOneAndUpdate(
      {
        userId: req.user._id,
        questionId: question._id
      },
      {
        userAnswer: answer,
        isCorrect
      },
      { upsert: true, returnDocument: "after" }
    )
    res.json({ isCorrect, correctAnswer: question.correctAnswer, explanation: question.explanation })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "提交答案失败" })
  }
})

export default questionRoutes
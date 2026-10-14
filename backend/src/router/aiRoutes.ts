import Express from "express"
import OpenAI from "openai"
import Resume from '../models/Resume'
import InterviewSession from "../models/InterviewSession"
import { analyzeResume, generateQuestions } from '../services/aiService'
import authMiddleware, { AuthRequest } from "../middlewares/auth"

const aiRoutes = Express.Router()
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL
})

//测试连通性
aiRoutes.get('/test', async (req, res) => {
  try {
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: "Hello!" }]
    })
    res.json({ message: 'AI接口连通成功', response: response.choices[0].message.content })
  }
  catch (error) {
    console.error('AI接口连通失败:', error)
    res.status(500).json({ message: 'AI接口连通失败', error })
  }
})

aiRoutes.post('/analyze-resume', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // 1. 查当前用户的简历
    const resume = await Resume.findOne({ userId: req.user!._id })
    if (!resume) {
      return res.status(404).json({ message: '请先上传简历' })
    }
    if (!resume.rawText) {
      return res.status(400).json({ message: '简历内容为空' })
    }
    // 2. 已有分析结果 → 直接返回
    if (resume.analysis && resume.analysis.skills?.length > 0) {
      return res.json({ analysis: resume.analysis, cached: true })
    }

    // 3. 调 AI 分析
    const analysis = await analyzeResume(resume.rawText)

    // 4. 存回数据库
    resume.analysis = analysis
    await resume.save()

    // 5. 返回
    res.json({ analysis, cached: false })
  } catch (error) {
    console.error('简历分析失败:', error)
    res.status(500).json({ message: '简历分析失败' })
  }
})

aiRoutes.post('/generate-questions', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const numQuestions = req.body.numQuestions || 5
    const resume = await Resume.findOne({ userId: req.user!._id })
    if (!resume?.analysis) {
      return res.status(400).json({ message: '请先分析简历' })
    }

    // 1. 先生成题目
    const questions = await generateQuestions(resume.analysis, numQuestions)

    // 2. 生成成功后再创建 session
    const interviewSession = new InterviewSession({
      userId: req.user!._id,
      resumeAnalysis: resume.analysis,
      questions
    })
    await interviewSession.save()

    // 3. 返回题目和 sessionId
    res.json({ sessionId: interviewSession._id, questions })
  } catch (error) {
    console.error('生成面试题失败:', error)
    res.status(500).json({ message: '生成面试题失败' })
  }
})

export default aiRoutes
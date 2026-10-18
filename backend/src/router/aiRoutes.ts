import Express from "express"
import OpenAI from "openai"
import Resume from '../models/Resume'
import InterviewSession from "../models/InterviewSession"
import { analyzeResume, generateQuestions, evaluateAnswer } from '../services/aiService'
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

//ai分析
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

//ai出题
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

//ai评估
aiRoutes.post('/evaluate-answer', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { sessionId, questionIndex, userAnswer } = req.body

    // 1. 参数校验
    if (!sessionId || questionIndex === undefined || !userAnswer) {
      return res.status(400).json({ message: '缺少必要参数 (sessionId, questionIndex, userAnswer)' })
    }

    // 2. 查出对应的面试 Session
    const session = await InterviewSession.findById(sessionId)
    if (!session) {
      return res.status(404).json({ message: '面试会话不存在' })
    }

    // 确保是当前用户自己的会话
    if (session.userId.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: '无权访问此面试会话' })
    }

    // 3. 获取对应的题目信息
    const currentQuestion = session.questions[questionIndex]
    if (!currentQuestion) {
      return res.status(400).json({ message: '题目索引越界' })
    }

    // 4. 调用 AI 进行评估
    const evaluation = await evaluateAnswer(
      currentQuestion.question,
      currentQuestion.keyPoints,
      currentQuestion.referenceAnswer,
      userAnswer
    )

    // 5. 更新题目记录并保存到数据库
    currentQuestion.userAnswer = userAnswer
    currentQuestion.aiScore = evaluation.score
    currentQuestion.aiFeedback = evaluation.feedback
    await session.save() // Mongoose 会自动保存对嵌套数组内对象的修改

    // 6. 返回评估结果（包含打分、反馈和下一步动作）
    res.json({
      score: evaluation.score,
      feedback: evaluation.feedback,
      action: evaluation.action, // next_question / follow_up / hint_and_retry
      followUpQuestion: evaluation.followUpQuestion
    })
  } catch (error) {
    console.error('评估答案失败:', error)
    res.status(500).json({ message: '评估答案失败' })
  }
})

export default aiRoutes
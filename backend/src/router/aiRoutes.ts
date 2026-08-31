import Express from "express"
import OpenAI from "openai"

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

export default aiRoutes
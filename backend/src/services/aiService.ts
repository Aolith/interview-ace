import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL
})

//简历分析
export const analyzeResume = async (rawText: string) => {
  try {
    // 调AI，返回分析结果
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system", content: `**角色设定：**
你是一位专业的招聘顾问，擅长从简历中提取关键信息。你的任务是将候选人的简历文本转换为结构化的 JSON 数据。

**提取规则：**
- **技术栈**：列出候选人掌握的所有编程语言、框架、工具（如 React、Node.js、Python）
- **工作年限**：如果有明确的工作经验年限，提取为数字；否则根据毕业年份推算，标记"推算值"
- **项目经验**：提取 1-3 个最具代表性的项目名称和简短描述（每个项目不超过 80 字）
- **教育背景**：提取最高学历、学校名称、专业

**输出格式（严格 JSON）：**
{
  "skills": ["技术1", "技术2", ...],
  "yearsOfExperience": 2,
  "projects": [
    { "name": "项目名称", "description": "精准描述" },
    ...
  ],
  "education": {
    "degree": "本科",
    "school": "学校名",
    "major": "专业名"
  }
}

**注意事项：**
- 如果某项信息未在简历中找到，填写 "未提供"
- skills 数组不要包含过于基础的技能（如 "Microsoft Office"）
- yearsOfExperience 如果是推算值，在值后面标注 "(推算)"
- yearsOfExperience 如果是在校生时，标记 "(大几年级)"，如 "(大一)"，如果是应届生，标记 "(应届生)"` },
        { role: "user", content: rawText }
      ]
    })
    const content = response.choices[0].message.content || ''

    // 清洗
    const jsonStartIndex = content.indexOf('{')
    const jsonEndIndex = content.lastIndexOf('}') + 1
    const jsonString = content.substring(jsonStartIndex, jsonEndIndex)
    // 解析
    const analysis = JSON.parse(jsonString)
    // 返回
    return analysis
  } catch (error) {
    console.error('简历分析失败:', error)
    throw new Error('简历分析失败')
  }
}

//AI生成面试题
export const generateQuestions = async (resumeAnalysis: any, numQuestions: number) => {
  try {
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `**角色设定：**
你是一位资深技术面试官，擅长根据候选人的简历背景设计有针对性的面试题。

**出题依据：**
- 根据 skills 列表，为主要技术方向出对应题目
- 根据 projects 项目经历，出相关的场景题（例如候选人做过 JWT 鉴权，就问鉴权方案设计）
- 根据 yearsOfExperience 调整难度：在校生/应届生问基础题，有工作经验的人问进阶或架构题
- 如果技能栈数量多于题目数量，优先选择候选人简历中出现的、最核心的技术

**出题数量：**
生成 ${numQuestions} 道面试题。

**题目类型：**
- 所有题目一律为简答题，type 必须为 "text"，不需要选项。不要生成单选题或编程题。

**输出格式（严格 JSON 数组）：**
[
  {
    "question": "题目内容",
    "type": "text",
    "category": "技术分类，必须是 skills 列表中的具体技术名",
    "difficulty": "easy 或 medium 或 hard",
    "keyPoints": ["考察点1", "考察点2"],
    "referenceAnswer": "参考答案要点"
  }
]

**注意事项：**
- 只输出 JSON 数组，不要输出任何其他文本、解释或代码块标记
- 不要生成 userAnswer、aiScore、aiFeedback 字段，这些是后续流程填充的
- 每道题的 keyPoints 至少 2 个，帮助后续评估用户回答
- 题目要真实、常见、有考察价值，不要偏题怪题`
        },
        { role: "user", content: JSON.stringify(resumeAnalysis) }
      ]
    })
    const content = response.choices[0].message.content || ''
    const start = content.indexOf('[')
    const end = content.lastIndexOf(']') + 1
    const questionsString = content.substring(start, end)
    const questions = JSON.parse(questionsString)
    return questions
  } catch (error) {
    console.error('面试题生成失败:', error)
    throw new Error('面试题生成失败')
  }
}

// AI评估答案与追问决策
export const evaluateAnswer = async (
  question: string,
  keyPoints: string[],
  referenceAnswer: string,
  userAnswer: string
) => {
  try {
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `**角色设定：**
你是一位资深技术面试官，正在进行一场模拟面试。你的任务是根据给出的题目、考察点、参考答案以及候选人的实际回答，进行评分，并决定下一步的面试策略。

**评分标准（100分制）：**
- **正确性（50%）**：回答的核心技术点是否正确，有无明显错误。
- **完整性（30%）**：是否覆盖了给定的 keyPoints，有无遗漏。
- **表达清晰度（20%）**：逻辑是否清晰，语言是否简洁。
（如果候选人回答过于简短、敷衍，或者完全错误，请给出低分。）

**决策规则（action）：**
- 如果 score >= 80：回答很好，返回 "next_question"。
- 如果 60 <= score < 80：部分正确，需要深挖，返回 "follow_up"。
- 如果 score < 60：回答错误或太水，给出提示让他重试，返回 "hint_and_retry"。

**输出格式（严格 JSON）：**
{
  "score": 85,
  "feedback": "回答基本正确，提到了xxx，但遗漏了yyy，建议补充...",
  "action": "follow_up", 
  "followUpQuestion": "如果 action 是 follow_up，这里填入针对遗漏点的追问；如果是 hint_and_retry，填入引导提示；如果是 next_question，填空字符串"
}

**注意事项：**
- 只输出 JSON 对象，不要输出其他任何文本或代码块标记。
- feedback 必须具体，指出好在哪、差在哪。
- 追问必须结合当前题目，不能问完全无关的新题。`
        },
        {
          role: "user",
          content: JSON.stringify({
            question,
            keyPoints,
            referenceAnswer,
            userAnswer
          })
        }
      ]
    })

    const content = response.choices[0].message.content || ''
    const start = content.indexOf('{')
    const end = content.lastIndexOf('}') + 1
    const jsonString = content.substring(start, end)
    const evaluation = JSON.parse(jsonString)

    return evaluation
  } catch (error) {
    console.error('评估答案失败:', error)
    throw new Error('评估答案失败')
  }
}
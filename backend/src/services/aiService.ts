//简历分析
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL
})

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

import React, { useState } from 'react'
import axios from 'axios'

const AIInterview: React.FC = () => {
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const [userAnswer, setUserAnswer] = useState('')
  const [evaluation, setEvaluation] = useState<any>(null)

  // 1. 开始面试（连调分析+出题接口）
  const handleStart = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      // 先分析简历（如果有缓存，后端会秒回）
      await axios.post('/api/ai/analyze-resume', {}, { headers })

      // 再生成题目（假设一次生成 3 道）
      const res = await axios.post('/api/ai/generate-questions', { numQuestions: 3 }, { headers })

      setSessionId(res.data.sessionId)
      setQuestions(res.data.questions)
      setCurrentIndex(0)
      setStarted(true)
    } catch (error: any) {
      alert(error.response?.data?.message || '开始面试失败，请确保已上传简历')
    } finally {
      setLoading(false)
    }
  }

  // 2. 提交回答并评估
  const handleSubmit = async () => {
    if (!userAnswer.trim()) return
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const res = await axios.post('/api/ai/evaluate-answer', {
        sessionId,
        questionIndex: currentIndex,
        userAnswer
      }, { headers: { Authorization: `Bearer ${token}` } })

      setEvaluation(res.data)
    } catch (error: any) {
      alert(error.response?.data?.message || '评估失败')
    } finally {
      setLoading(false)
    }
  }

  // 3. 下一题
  const handleNext = () => {
    setCurrentIndex((i) => i + 1)
    setUserAnswer('')
    setEvaluation(null)
  }

  // ============ 初始界面 ============
  if (!started) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI 模拟面试</h2>
          <p className="text-gray-500 mb-8">
            系统将分析你的简历，并生成 3 道量身定制的面试题。
          </p>
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? '正在准备面试...' : '开始面试'}
          </button>
        </div>
      </div>
    )
  }

  // ============ 结束界面 ============
  if (currentIndex >= questions.length) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">面试结束</h2>
          <p className="text-gray-500 mb-8">本次 AI 模拟面试已完成。</p>
          <button
            onClick={() => { setStarted(false); setQuestions([]); setSessionId(''); }}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition"
          >
            再来一次
          </button>
        </div>
      </div>
    )
  }

  // ============ 答题界面 ============
  const currentQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100 flex items-start justify-center">
      <div className="max-w-3xl w-full mx-4 mt-10">
        {/* 进度条 */}
        <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
          <span>第 {currentIndex + 1} / {questions.length} 题</span>
          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">{currentQuestion.category}</span>
        </div>

        {/* 对话区域 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* 用户输入区 (如果还没评估) */}
          {!evaluation ? (
            <>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="请输入你的回答..."
                rows={6}
                className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none mb-4"
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !userAnswer.trim()}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'AI 正在评估...' : '提交回答'}
              </button>
            </>
          ) : (
            // 评估结果展示区
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">你的回答</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700">{userAnswer}</div>
              </div>

              <div className={`p-4 rounded-lg font-medium ${evaluation.score >= 80 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                得分：{evaluation.score} 分
                <p className="text-sm mt-2 font-normal">{evaluation.feedback}</p>
              </div>

              {/* AI 追问 */}
              {(evaluation.action === 'follow_up' || evaluation.action === 'hint_and_retry') && evaluation.followUpQuestion && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-800 mb-1">AI 面试官追问</h3>
                  <p className="text-blue-700">{evaluation.followUpQuestion}</p>
                  {/* 如果这里要允许用户直接回答追问，可以继续扩展逻辑 */}
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition"
              >
                进入下一题
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIInterview
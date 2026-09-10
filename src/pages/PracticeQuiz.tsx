import React, { useState } from 'react'
import axios from 'axios'

const Practice: React.FC = () => {
  const categories = ["HTML/CSS", "JavaScript", "React", "Vue", "网络与浏览器", "工程化"]
  const difficulties = [
    { label: '简单', value: 'easy' },
    { label: '中等', value: 'medium' },
    { label: '困难', value: 'hard' },
  ]
  const counts = [5, 10]

  // 配置状态
  const [category, setCategory] = useState('JavaScript')
  const [difficulty, setDifficulty] = useState('medium')
  const [questionType, setQuestionType] = useState('single')
  const [count, setCount] = useState(5)

  // 练习状态
  const [started, setStarted] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  // 开始练习：抽题
  const handleStart = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const res = await axios.get(
        `/api/questions/practice?category=${encodeURIComponent(category)}&difficulty=${difficulty}&count=${count}&type=${questionType}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setQuestions(res.data.questions)
      setCurrentIndex(0)
      setSelectedAnswer('')
      setResult(null)
      setCorrectCount(0)
      setStarted(true)
    } catch (error: any) {
      alert(error.response?.data?.message || '抽题失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 提交答案
  const handleSubmit = async () => {
    if (!selectedAnswer) {
      alert('请先选择答案')
      return
    }
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        `/api/questions/${questions[currentIndex]._id}/answer`,
        { answer: selectedAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResult(res.data)
      if (res.data.isCorrect) setCorrectCount((c) => c + 1)
    } catch (error: any) {
      alert(error.response?.data?.message || '提交失败，请重试')
    }
  }

  // 下一题
  const handleNext = () => {
    setCurrentIndex((i) => i + 1)
    setSelectedAnswer('')
    setResult(null)
  }

  // 重新开始
  const handleRestart = () => {
    setStarted(false)
    setQuestions([])
    setCurrentIndex(0)
    setSelectedAnswer('')
    setResult(null)
    setCorrectCount(0)
  }

  // ============ 配置界面 ============
  if (!started) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100 flex items-start justify-center">
        <div className="max-w-2xl w-full mx-4 mt-10 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">开始练习</h2>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">分类</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm transition ${category === cat
                    ? 'bg-indigo-500 text-white font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">难度</h3>
            <div className="flex gap-2">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`px-4 py-2 rounded-lg text-sm transition ${difficulty === d.value
                    ? 'bg-indigo-500 text-white font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">题型</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setQuestionType('single')}
                className={`px-6 py-2 rounded-lg text-sm transition ${questionType === 'single'
                  ? 'bg-indigo-500 text-white font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
              >
                选择题
              </button>
              <button
                onClick={() => setQuestionType('text')}
                className={`px-6 py-2 rounded-lg text-sm transition ${questionType === 'text'
                  ? 'bg-indigo-500 text-white font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
              >
                简答题
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">题数</h3>
            <div className="flex gap-2">
              {counts.map((c) => (
                <button
                  key={c}
                  onClick={() => setCount(c)}
                  className={`px-6 py-2 rounded-lg text-sm transition ${count === c
                    ? 'bg-indigo-500 text-white font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                >
                  {c} 道
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? '加载中...' : '开始练习'}
          </button>
        </div>
      </div>
    )
  }

  // ============ 答题结束总结 ============
  if (currentIndex >= questions.length) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100 flex items-start justify-center">
        <div className="max-w-2xl w-full mx-4 mt-10 bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">练习完成！</h2>
          <p className="text-4xl font-bold text-indigo-600 mb-2">
            {correctCount} / {questions.length}
          </p>
          <p className="text-gray-500 mb-8">本次答对题数</p>
          <button
            onClick={handleRestart}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            再来一组
          </button>
        </div>
      </div>
    )
  }

  // ============ 答题界面 ============
  const currentQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100 flex items-start justify-center">
      <div className="max-w-2xl w-full mx-4 mt-10 bg-white rounded-xl shadow-lg p-8">
        {/* 顶部进度 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">
              第 {currentIndex + 1} / {questions.length} 题
            </span>
            <div className="flex gap-2">
              <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                {currentQuestion.category}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {currentQuestion.type === 'single' ? '选择题' : '简答题'}
              </span>
            </div>
          </div>

          {/* 进度条 */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 题目 */}
        <h2 className="text-lg font-bold text-gray-900 leading-relaxed mb-6">
          {currentQuestion.question}
        </h2>

        {/* ===== 选择题：选项列表 ===== */}
        {currentQuestion.type === 'single' && (
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option: string, index: number) => {
              let optionClass = 'bg-white border-gray-200 hover:border-indigo-300'
              if (result) {
                if (option === result.correctAnswer) {
                  optionClass = 'bg-green-50 border-green-300'
                } else if (option === selectedAnswer && !result.isCorrect) {
                  optionClass = 'bg-red-50 border-red-300'
                } else {
                  optionClass = 'bg-white border-gray-200'
                }
              } else if (option === selectedAnswer) {
                optionClass = 'bg-indigo-50 border-indigo-300'
              }
              return (
                <div
                  key={index}
                  onClick={() => !result && setSelectedAnswer(option)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${optionClass}`}
                >
                  <span className="font-medium text-gray-500 mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-gray-700">{option}</span>
                  {result && option === result.correctAnswer && (
                    <span className="ml-2 text-xs font-medium text-green-600">✓ 正确答案</span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ===== 简答题：文本框 ===== */}
        {currentQuestion.type === 'text' && (
          <div className="mb-6">
            <textarea
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={!!result}
              placeholder="请输入你的答案..."
              rows={5}
              className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent disabled:bg-gray-50 resize-none"
            />
          </div>
        )}

        {/* 提交后显示结果和解析 */}
        {result && (
          <div className="mb-6">
            <div className={`p-4 rounded-lg mb-4 font-medium ${result.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
              {result.isCorrect ? '✓ 回答正确' : '✗ 回答错误'}
            </div>

            {/* 简答题显示参考答案 */}
            {currentQuestion.type === 'text' && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">参考答案</h3>
                <div className="bg-blue-50 rounded-lg p-4 text-blue-800 leading-relaxed">
                  {result.correctAnswer}
                </div>
              </div>
            )}

            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">解析</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 leading-relaxed">
              {result.explanation}
            </div>
          </div>
        )}

        {/* 按钮 */}
        {!result ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer.trim()}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            提交答案
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-lg transition"
          >
            {currentIndex + 1 >= questions.length ? '查看结果' : '下一题'}
          </button>
        )}
      </div>
    </div>
  )
}

export default Practice
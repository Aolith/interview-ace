import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const WrongQuiz: React.FC = () => {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'single'
  const navigate = useNavigate()

  const [items, setItems] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [correctCount, setCorrectCount] = useState(0)

  useEffect(() => {
    const fetchWrong = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`/api/questions/wrong?type=${type}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setItems(res.data.questions)
      } catch (error) {
        console.error('获取错题失败', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWrong()
  }, [type])

  const handleSubmit = async () => {
    if (!selectedAnswer.trim()) return
    try {
      const token = localStorage.getItem('token')
      const currentItem = items[currentIndex]
      const res = await axios.post(
        `/api/questions/${currentItem.question._id}/answer`,
        { answer: selectedAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // 把上次答案一起存进 result，提交后展示
      setResult({
        ...res.data,
        previousAnswer: currentItem.userAnswer
      })
      if (res.data.isCorrect) setCorrectCount((c) => c + 1)
    } catch (error: any) {
      alert(error.response?.data?.message || '提交失败，请重试')
    }
  }

  const handleNext = () => {
    setCurrentIndex((i) => i + 1)
    setSelectedAnswer('')
    setResult(null)
  }

  const handleBack = () => navigate('/review')

  // ============ 加载中 ============
  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100 flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  // ============ 没有错题 ============
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100 flex items-start justify-center">
        <div className="max-w-2xl w-full mx-4 mt-10 bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500 mb-6">这个题型暂时没有错题</p>
          <button
            onClick={handleBack}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            返回复盘页
          </button>
        </div>
      </div>
    )
  }

  // ============ 做完了 ============
  if (currentIndex >= items.length) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100 flex items-start justify-center">
        <div className="max-w-2xl w-full mx-4 mt-10 bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">错题重做完成！</h2>
          <p className="text-4xl font-bold text-indigo-600 mb-2">
            {correctCount} / {items.length}
          </p>
          <p className="text-gray-500 mb-8">本次答对题数（答对后将自动移出错题本）</p>
          <button
            onClick={handleBack}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            返回复盘页
          </button>
        </div>
      </div>
    )
  }

  // ============ 答题界面 ============
  const currentItem = items[currentIndex]
  const q = currentItem.question

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-sky-100 via-white to-violet-100 flex items-start justify-center">
      <div className="max-w-2xl w-full mx-4 mt-10 bg-white rounded-xl shadow-lg p-8">
        {/* 顶部进度 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">
              第 {currentIndex + 1} / {items.length} 题
            </span>
            <div className="flex gap-2">
              <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                {q.category}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {q.type === 'single' ? '选择题' : '简答题'}
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 leading-relaxed mb-6">{q.question}</h2>

        {/* 选择题选项 */}
        {q.type === 'single' && (
          <div className="space-y-3 mb-6">
            {q.options.map((option: string, index: number) => {
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

        {/* 简答题文本框 */}
        {q.type === 'text' && (
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

        {/* 提交后展示结果 */}
        {result && (
          <div className="mb-6">
            <div className={`p-4 rounded-lg mb-4 font-medium ${result.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
              {result.isCorrect ? '✓ 回答正确，已从错题本移除' : '✗ 回答错误'}
            </div>

            {/* 上次你的答案 */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">上次你的答案</h3>
              <div className="bg-orange-50 rounded-lg p-4 text-orange-700">
                {result.previousAnswer}
              </div>
            </div>

            {/* 简答题显示参考答案 */}
            {q.type === 'text' && (
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
            {currentIndex + 1 >= items.length ? '查看结果' : '下一题'}
          </button>
        )}
      </div>
    </div>
  )
}

export default WrongQuiz
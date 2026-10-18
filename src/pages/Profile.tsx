import React, { useState, useRef } from 'react'
import { useUserStore } from "../store/useUserStore"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Profile: React.FC = () => {
  const user = useUserStore(state => state.user)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const updateUser = useUserStore((state) => state.updateUser)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const hasResume = user?.hasResume
  const rawText = user?.rawText

  const loginOut = useUserStore((state) => state.loginOut)
  const navigate = useNavigate()

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('仅支持 PDF 或 Word 文档')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      setUploading(true)
      const token = localStorage.getItem('token')
      const res = await axios.post('/api/upload/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      alert('简历上传成功！')
      await updateUser({ hasResume: true, rawText: res.data.rawText } as any)
    } catch (error: any) {
      alert(error.response?.data?.message || '上传失败，请重试');
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // 用于快速渲染单行信息
  const renderField = (
    label: string,
    fieldKey: string,
    value: string | number | undefined,
    type: 'text' | 'number' | 'select' = 'text',
    options?: string[]
  ) => {
    const isEditing = editingField === fieldKey
    const displayValue = value || (type === 'number' ? '未设置' : '未设置')

    return (
      <div className="flex items-center py-4 border-b border-gray-100 last:border-0">
        <dt className="w-24 text-sm font-medium text-gray-500 shrink-0">{label}</dt>
        <dd className="flex-1 text-gray-900">
          {!isEditing ? (
            <div
              className={`inline-block px-2 py-1 -ml-2 rounded-md transition cursor-pointer hover:bg-gray-100 ${fieldKey === 'email' ? 'cursor-not-allowed hover:bg-transparent text-gray-500' : ''
                }`}
              onClick={() => {
                if (fieldKey === 'email') return
                setEditingField(fieldKey)
                setEditValue(String(value || ''))
              }}
            >
              {displayValue}
            </div>
          ) : (
            type === 'select' ? (
              <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={async () => {
                  try { await updateUser({ [fieldKey]: editValue }); setEditingField(null); }
                  catch (error) { alert('更新失败'); }
                }}
                className="border border-indigo-300 rounded-md px-3 py-1.5 w-40 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                autoFocus
              >
                {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input
                type={type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={async () => {
                  try {
                    if (editValue === '') { setEditingField(null); return; }
                    const val = type === 'number' ? Number(editValue) : editValue;
                    await updateUser({ [fieldKey]: val });
                    setEditingField(null);
                  } catch (error) { alert('更新失败'); }
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    try {
                      if (editValue === '') { setEditingField(null); return; }
                      const val = type === 'number' ? Number(editValue) : editValue;
                      await updateUser({ [fieldKey]: val });
                      setEditingField(null);
                    } catch (error) { alert('更新失败'); }
                  }
                }}
                className="border border-indigo-300 rounded-md px-3 py-1.5 w-48 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                autoFocus
              />
            )
          )}
        </dd>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-24 pb-12 bg-gradient-to-br from-sky-300 via-indigo-200 to-violet-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8 sm:p-10 relative">

        {/* 顶部标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">个人主页</h1>
          <p className="text-sm text-gray-500 mt-1">完善个人信息，让 AI面试官 更了解你</p>
        </div>

        {/* 信息展示区域 */}
        <div className="mb-8">
          {renderField('用户名', 'username', user?.username || 'candidate')}
          {renderField('邮箱', 'email', user?.email || '未绑定')}
          {renderField('性别', 'sex', user?.sex || '未知', 'select', ['男', '女', '未知'])}
          {renderField('年龄', 'age', user?.age, 'number')}
          {renderField('最高学历', 'degree', user?.degree || '未设置', 'select', ['保密', '高中', '大专', '本科', '硕士', '博士'])}

          {/* 简历上传区 */}
          <div className="flex items-center py-4">
            <dt className="w-24 text-sm font-medium text-gray-500 shrink-0">我的简历</dt>
            <dd className="flex-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
              />
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {hasResume ? '已上传简历，可用于 AI 面试分析' : '尚未上传简历'}
                </div>
                <div className="flex items-center gap-3">
                  {hasResume && (
                    <button
                      onClick={() => alert(rawText || '暂无简历内容')}
                      className="text-sm font-medium text-indigo-300 hover:text-indigo-800 transition"
                    >
                      预览解析
                    </button>
                  )}
                  <button
                    onClick={handleUploadClick}
                    disabled={uploading}
                    className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium px-5 py-1.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {uploading ? '上传中...' : (hasResume ? '更新简历' : '点击上传')}
                  </button>
                </div>
              </div>
            </dd>
          </div>
        </div>

        {/* 底部按钮区域 */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            onClick={() => { loginOut(); navigate('/welcome') }}
            className="px-6 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-200 transition duration-200"
          >
            退出登录
          </button>
        </div>

      </div>
    </div>
  )
}

export default Profile
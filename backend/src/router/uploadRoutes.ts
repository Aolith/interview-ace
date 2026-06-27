import express from 'express'
import multer from 'multer'
import path from 'path'
import authMiddleware, { AuthRequest } from '../middlewares/auth'
import Resume from '../models/Resume'
import PDFParser from 'pdf2json'
import mammoth from 'mammoth'
import fs from 'fs'

const uploadRoutes = express.Router()

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  },
})

// 文件过滤器：只允许 PDF、word等常见简历格式
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('不支持的文件格式，请上传 PDF或 Word 文档'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制 5MB
})
// 提取 PDF 文本的辅助函数
function extractPDFText(filePath: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const pdfBuffer = await fs.promises.readFile(filePath)
      const pdfParser = new PDFParser()

      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        const text = pdfData.Pages.map(page =>
          page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(' ')
        ).join('\n')
        resolve(text)
      })

      pdfParser.on('pdfParser_dataError', (error) => {
        reject(error)
      })

      pdfParser.parseBuffer(pdfBuffer)
    } catch (error) {
      reject(error)
    }
  })
}

// 上传简历
uploadRoutes.post('/resume', authMiddleware, upload.single('resume'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请选择要上传的文件' })
    }
    const filePath = req.file.path
    const fileType = req.file.mimetype
    let rawText = ''
    //pdf转纯文本
    if (fileType === 'application/pdf') {
      rawText = await extractPDFText(filePath)
    }
    //word转纯文本
    if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: filePath })
      rawText = result.value
    }
    if (!rawText.trim()) {
      return res.status(400).json({ message: '文件解析失败，请检查文件内容是否为空' })
    }
    // 存入或更新数据库
    const resume = await Resume.findOneAndUpdate(
      { userId: req.user!._id },
      { rawText },
      { upsert: true, new: true }
    )
    res.json({
      message: '简历上传并解析成功',
      rawText: resume.rawText,
      fileName: req.file.filename// 方便前端构建下载链接 
    })
  } catch (error) {
    console.log('上传简历失败', error)
    res.status(500).json({ message: '服务器内部错误' })
  }
})


export default uploadRoutes
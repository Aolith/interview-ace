import express from 'express'
import multer from 'multer'
import path from 'path'

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

// 上传简历
uploadRoutes.post('/resume', upload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '请选择要上传的文件' })
  }

  // 返回文件信息给前端（后续可以存到数据库）
  res.json({
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size,
    path: req.file.path,
    url: `/uploads/${req.file.filename}`, // 供前端预览或下载
  })
})


export default uploadRoutes
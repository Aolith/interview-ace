import mongoose, { Document, Schema } from "mongoose"

export interface IQuestion extends Document {
  type: string
  category: string
  difficulty: string
  question: string
  correctAnswer: string
  options: string[]
  explanation: string
}

const QuestionSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['single', 'text'],
      required: true
    },
    category: {
      type: String,
      enum: ['HTML/CSS', 'JavaScript', 'Vue', 'React', '网络与浏览器', '工程化'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true
    },
    question: {
      type: String,
      required: true
    },
    correctAnswer: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      default: []
    },
    explanation: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IQuestion>('Question', QuestionSchema)
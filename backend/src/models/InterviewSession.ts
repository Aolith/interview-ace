import mongoose, { Document, Schema, Types } from "mongoose"

export interface IInterviewSession extends Document {
  userId: Types.ObjectId,           // 谁在面试
  resumeAnalysis: {
    skills: string[]
    yearsOfExperience: string
    projects: { name: string, description: string }[]
    education: { degree: string, school: string, major: string }
  },     // 用了哪份简历分析（快照，防止简历被改）
  status: "in_progress" | "completed",
  questions:              // AI生成的题目
  {
    question: string,
    type: string,
    category: string,
    difficulty: string,
    keyPoints: string[],
    referenceAnswer: string,
    userAnswer?: string,     // 用户答完填
    aiScore?: number,        // AI评估后填
    aiFeedback?: string,     // AI反馈
  }[],
}

const InterviewSessionSchema: Schema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    resumeAnalysis: {
      type: Schema.Types.Mixed,
      required: true
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress"
    },
    questions: [{
      question: { type: String, required: true },
      type: { type: String, required: true },
      category: { type: String, required: true },
      difficulty: { type: String, required: true },
      keyPoints: [{ type: String }],
      referenceAnswer: { type: String, required: true },
      userAnswer: { type: String },
      aiScore: { type: Number },
      aiFeedback: { type: String }
    }]
  }, {
  timestamps: true
}
)

export default mongoose.model<IInterviewSession>('InterviewSession', InterviewSessionSchema)

import mongoose, { Document, Schema } from "mongoose"

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId
  rawText: string
  analysis?: {
    skills: string[]
    yearsOfExperience: string
    projects: { name: string, description: string }[]
    education: { degree: string, school: string, major: string }
  }
}

const ResumeSchema = new Schema<IResume>({
  userId: {
    //指向用户的id
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rawText: {
    type: String,
    required: true
  },
  analysis: {
    skills: [String],//技能栈
    yearsOfExperience: String,//经验水平
    projects: [{ name: String, description: String }],//项目经历
    education: { degree: String, school: String, major: String }//教育背景
  }
}, {
  timestamps: true
})

export default mongoose.model<IResume>("Resume", ResumeSchema)
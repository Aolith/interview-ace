import mongoose, { Document, Schema } from "mongoose"

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId
  rawText: string
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
  }
}, {
  timestamps: true
})

export default mongoose.model<IResume>("Resume", ResumeSchema)
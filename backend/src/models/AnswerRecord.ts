import mongoose, { Document, Schema, Types } from "mongoose"

export interface IAnswerRecord extends Document {
  userId: Types.ObjectId
  questionId: Types.ObjectId
  userAnswer: string
  isCorrect: boolean
}

const AnswerRecordSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },
    userAnswer: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IAnswerRecord>('AnswerRecord', AnswerRecordSchema)
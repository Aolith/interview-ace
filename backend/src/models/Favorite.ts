import mongoose, { Document, Schema, Types } from "mongoose"

export interface IFavorite extends Document {
  userId: Types.ObjectId
  questionId: Types.ObjectId
}

const FavoriteSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    questionId: {
      type: Types.ObjectId,
      ref: "Question",
      required: true
    }
  },
  {
    timestamps: true
  }
)

// 联合唯一索引：同一个用户对同一道题只能有一条收藏记录
FavoriteSchema.index({ userId: 1, questionId: 1 }, { unique: true })

export default mongoose.model<IFavorite>('Favorite', FavoriteSchema)
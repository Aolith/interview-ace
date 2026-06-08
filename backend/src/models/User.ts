import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  username: string
  password: string
  email: string
  age: number
  sex: string
  degree: string
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
      default: 18,
    },
    sex: {
      type: String,
      enum: ['男', '女', '未知'],
      default: '未知',
    },
    degree: {
      type: String,
      enum: ['保密', '高中', '大专', '本科', '硕士', '博士'],
      default: '保密',
    },
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IUser>('User', UserSchema)
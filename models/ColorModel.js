import mongoose, { Schema } from 'mongoose'

const ColorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

const Color = mongoose.model('Color', ColorSchema)

export default Color

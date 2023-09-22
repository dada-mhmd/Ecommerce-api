import mongoose, { Schema } from 'mongoose'

const ReviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product must belong to a user'],
    },
    message: {
      type: String,
      required: [true, 'Review must have a message'],
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
)

const Review = mongoose.model('Review', ReviewSchema)

export default Review

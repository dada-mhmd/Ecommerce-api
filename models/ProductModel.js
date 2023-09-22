import mongoose, { Schema } from 'mongoose'

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      ref: 'Category',
      required: true,
    },
    sizes: {
      type: [String],
      enum: ['S', 'M', 'L', 'XL', 'XXL'],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: [
      {
        type: String,
        default: 'https://via.placeholder.com/150',
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    totalQty: {
      type: Number,
      default: 0,
    },
    totalSold: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

// virtuals
ProductSchema.virtual('qtyLeft').get(function () {
  const product = this
  return product?.totalQty - product?.totalSold
})

// total rating
ProductSchema.virtual('totalReviews').get(function () {
  const product = this
  return product?.reviews?.length
})
// average rating
ProductSchema.virtual('averageRating').get(function () {
  const product = this
  // return (
  //   product?.reviews?.reduce((acc, review) => acc + review.rating, 0) /
  //   product?.reviews?.length
  // )
  const average =
    product?.reviews?.reduce((acc, review) => acc + review.rating, 0) /
    product?.reviews?.length
  return average.toFixed(1)
})

const Product = mongoose.model('Product', ProductSchema)

export default Product

import mongoose, { Schema } from 'mongoose'

const BrandSchema = new Schema(
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
    image: {
      type: String,
      default: 'https://picsum.photos/200/300',
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
)

const Brand = mongoose.model('Brand', BrandSchema)

export default Brand

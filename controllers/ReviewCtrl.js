import Review from '../models/ReviewModel.js'
import asyncHandler from 'express-async-handler'
import Product from './../models/ProductModel.js'

//@desc create reviews
//@route POST /api/v1/reviews
//@access Private/admin

export const createReview = asyncHandler(async (req, res) => {
  const { product, message, rating } = req.body
  // find product
  const { productID } = req.params
  const productFound = await Product.findById(productID).populate('reviews')
  if (!productFound) {
    throw new Error('Product not found')
  }

  //   check if user already reviewed the product
  const hasReviewed = productFound?.reviews?.find(
    (review) => review?.user?.toString() === req?.userAuthId?.toString()
  )

  if (hasReviewed) {
    throw new Error('You have already reviewed this product')
  }

  // create review
  const review = await Review.create({
    user: req.userAuthId,
    product: productFound._id,
    message,
    rating,
  })

  //   push review into product found
  productFound.reviews.push(review?._id)
  await productFound.save()

  res.status(201).json({
    status: true,
    message: 'Review created successfully',
  })
})

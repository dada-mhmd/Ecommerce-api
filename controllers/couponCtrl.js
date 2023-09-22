import asyncHandler from 'express-async-handler'
import Coupon from '../models/CouponModel.js'

// @desc create coupon
// @route POST /api/v1/coupons
// @access Private/admin

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body

  // check if admin

  //   check if coupon exist
  const couponExists = await Coupon.findOne({ code })
  if (couponExists) {
    throw new Error('Coupon already exists')
  }
  //   check if discount is a number
  if (isNaN(discount)) {
    throw new Error('Discount must be a number')
  }

  //   create coupon
  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  })
  res.json({
    status: 'success',
    message: 'Coupon created',
    coupon,
  })
})

// @desc get all coupons
// @route GET /api/v1/coupons
// @access private/admin
export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find()
  res.json({
    status: 'success',
    message: 'Coupons fetched',
    coupons,
  })
})

// @desc get single coupon
// @route GET /api/v1/coupons/:id
// @access private/admin

export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id)
  res.json({
    status: 'success',
    message: 'Coupon fetched',
    coupon,
  })
})

// @desc update coupon
// @route PUT /api/v1/coupons/:id
// @access private/admin

export const updateCoupon = asyncHandler(async (req, res) => {
  const { code, discount, startDate, endDate } = req.body
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
    code: code?.toUpperCase(),
    discount,
    startDate,
    endDate,
  })
  res.json(
    {
      status: 'success',
      message: 'Coupon updated',
      coupon,
    },
    { new: true }
  )
  res.json({
    status: 'success',
    message: 'Coupon updated',
    coupon,
  })
})

// @desc delete coupon
// @route DELETE /api/v1/coupons/:id
// @access private/admin

export const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id)
  res.json({
    status: 'success',
    message: 'Coupon deleted',
  })
})

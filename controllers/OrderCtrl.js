import dotenv from 'dotenv'
dotenv.config()
import Stripe from 'stripe'
import Order from '../models/OrderModel.js'
import asyncHandler from 'express-async-handler'
import User from '../models/UserModel.js'
import Product from '../models/ProductModel.js'
import Coupon from '../models/CouponModel.js'

// @desc create order
// @route POST /api/v1/orders
// @access Private/admin

// stripe
const stripe = new Stripe(process.env.STRIPE_KEY)

export const createOrder = asyncHandler(async (req, res) => {
  // get coupon
  const { coupon } = req.query
  //   check if coupon exist
  const couponFound = await Coupon.findOne({ code: coupon?.toUpperCase() })
  if (couponFound?.isExpired) {
    throw new Error('Coupon expired')
  }

  if (!couponFound) {
    throw new Error('Coupon does not exist')
  }

  // get discount
  const discount = couponFound?.discount / 100

  //   get the payload
  const { orderItems, shippingAddress, totalPrice } = req.body

  // find the user
  const user = await User.findById(req.userAuthId)

  // check if user has shipping address
  if (!user?.shippingAddress) {
    throw new Error('Please provide shipping address')
  }

  //   check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error('No order items')
  }

  //   create order and save to db
  const order = await Order.create({
    user: user._id,
    orderItems,
    shippingAddress,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  })

  // update the product quantity
  const products = await Product.find({ _id: { $in: orderItems } })
  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id.toString() === order?._id.toString()
    })
    if (product) {
      product.totalSold += order.qty
    }
    await product.save()
  })

  //   push the order to the user
  user.orders.push(order?._id)
  await user.save()

  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    }
  })

  //   make payment with stripe
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: 'payment',
    success_url: 'http://localhost:5173/success',
    cancel_url: 'http://localhost:5173/cancel',
  })
  res.send({ url: session.url })
})

// @desc get all orders
// @route GET /api/v1/orders
// @access Private

export const getAllOrders = asyncHandler(async (req, res) => {
  // find all orders
  const orders = await Order.find()
  res.json({
    status: true,
    message: 'Orders fetched',
    orders,
  })
})

// @desc get single order
// @route GET /api/v1/orders/:id
// @access Private
export const getSingleOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  res.json({
    status: true,
    message: 'Order fetched',
    order,
  })
})

// @desc update order to delivered
// @route PUT /api/v1/orders/update/:id
// @access Private/admin

export const updateOrder = asyncHandler(async (req, res) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  )
  res.json({
    status: true,
    message: 'Order updated',
    updatedOrder,
  })
})

// @desc get sale sum of orders
// @route GET /api/v1/orders/sale/sum
// @access Private/admin

export const getOrderStatistics = asyncHandler(async (req, res) => {
  // get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: '$totalPrice',
        },
        totalSales: {
          $sum: '$totalPrice',
        },
        maxSale: {
          $max: '$totalPrice',
        },
        avgSale: {
          $avg: '$totalPrice',
        },
      },
    },
  ])

  // get the date
  const date = new Date()
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $get: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: '$totalPrice',
        },
      },
    },
  ])

  res.json({
    success: true,
    message: 'Sum of orders',
    orders,
    saleToday,
  })
})

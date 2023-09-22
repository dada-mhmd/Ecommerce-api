import User from '../models/UserModel.js'
import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import { getTokenFromHeader } from '../utils/getTokenFromHeader.js'
import { verifyToken } from '../utils/verifyToken.js'

// @desc Register user
// @route POST /api/v1/users/register
// @access Private/Admin

export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body
  // check if user exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new Error('User already exists')
  }

  //   hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  //   create user
  const user = await User.create({ fullname, email, password: hashedPassword })

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: user,
  })
})

// @desc Login user
// @route POST /api/v1/users/login
// @access Public

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  //   find the user in db
  const userFound = await User.findOne({ email })
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    res.json({
      status: 'success',
      message: 'User logged in successfully',
      userFound,
      token: generateToken(userFound._id),
    })
  } else {
    throw new Error('Invalid credentials')
  }
})

//  @desc get user profile
//  @route GET /api/v1/users/profile
//  @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  // find the user
  const user = await User.findById(req.userAuthId).populate('orders')
  res.json({
    status: 'success',
    message: 'User profile fetched successfully',
    user,
  })
})

// @desc update user shipping address
// @route PUT /api/v1/users/profile/shipping
// @access Private

export const updateShippingAddress = asyncHandler(async (req, res) => {
  const { firstName, lastName, address, city, postalCode, province, phone } =
    req.body

  //   find the user in db
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
      },
      hasShippingAddress: true,
    },
    { new: true }
  )
  res.json({
    status: 'success',
    message: 'Shipping address updated successfully',
    user,
  })
})

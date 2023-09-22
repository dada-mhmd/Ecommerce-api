import Color from '../models/ColorModel.js'
import asyncHandler from 'express-async-handler'

// @desc create color
// @route POST /api/v1/colors
// @access Private/admin

export const createColor = asyncHandler(async (req, res) => {
  const { name } = req.body
  const colorFound = await Color.findOne({ name })
  // check if brand exist
  if (colorFound) {
    throw new Error('Color already exist')
  }

  //   create
  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  })
  res.json({
    status: 'success',
    message: 'Color created successfully',
    color,
  })
})

// @desc get all color
// @route GET /api/v1/colors
// @access public

export const getAllColors = asyncHandler(async (req, res) => {
  const colors = await Color.find()

  res.json({
    status: 'success',
    message: 'Colors fetched',
    colors,
  })
})

// @desc get single color
// @route GET /api/v1/colors/:id
// @access Public

export const getSingleColor = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id)

  res.json({
    status: 'success',
    message: 'color fetched',
    color,
  })
})

// @desc update color
// @route PUT /api/v1/colors/:id
// @access Private/admin

export const updateColor = asyncHandler(async (req, res) => {
  const { name } = req.body

  const color = await Color.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true }
  )
  res.json({
    status: 'success',
    message: 'color updated',
    color,
  })
})

// @desc Delete color
// @route DELETE /api/v1/colors/:id
// @access Private/Admin
export const deleteColor = asyncHandler(async (req, res) => {
  await Color.findByIdAndDelete(req.params.id)
  res.json({
    status: 'success',
    message: 'Color deleted',
  })
})

import Brand from './../models/BrandModel.js'
import asyncHandler from 'express-async-handler'

// @desc create brand
// @route POST /api/v1/brands
// @access Private/admin

export const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body
  const brandFound = await Brand.findOne({ name })
  // check if brand exist
  if (brandFound) {
    throw new Error('Brand already exist')
  }

  //   create cat
  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  })
  res.json({
    status: 'success',
    message: 'Brand created successfully',
    brand,
  })
})

// @desc get all brands
// @route GET /api/v1/brands
// @access public

export const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find()

  res.json({
    status: 'success',
    message: 'Brands fetched',
    brands,
  })
})

// @desc get single brands
// @route GET /api/v1/brands/:id
// @access Public

export const getSingleBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id)

  res.json({
    status: 'success',
    message: 'brand fetched',
    brand,
  })
})

// @desc update brand
// @route PUT /api/v1/brands/:id
// @access Private/admin

export const updateBrand = asyncHandler(async (req, res) => {
  const { name } = req.body

  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true }
  )
  res.json({
    status: 'success',
    message: 'Brand updated',
    brand,
  })
})

// @desc Delete brand
// @route DELETE /api/v1/brands/:id
// @access Private/Admin
export const deleteBrand = asyncHandler(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id)
  res.json({
    status: 'success',
    message: 'Brand deleted',
  })
})

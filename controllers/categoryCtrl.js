import Category from '../models/CategoryModel.js'
import asyncHandler from 'express-async-handler'

// @desc create category
// @route POST /api/v1/categories
// @access Private/admin

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body
  const categoryFound = await Category.findOne({ name })
  // check if category exist
  if (categoryFound) {
    throw new Error('Category already exist')
  }

  //   create cat
  const category = await Category.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
    image: req.file.path,
  })
  res.json({
    status: 'success',
    message: 'Category created successfully',
    category,
  })
})

// @desc get all categories
// @route GET /api/v1/categories
// @access public

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find()

  res.json({
    status: 'success',
    message: 'Categories fetched',
    categories,
  })
})

// @desc get single category
// @route GET /api/v1/categories/:id
// @access Public

export const getSingleCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  res.json({
    status: 'success',
    message: 'category fetched',
    category,
  })
})

// @desc update category
// @route PUT /api/v1/categories/:id
// @access Private/admin

export const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true }
  )
  res.json({
    status: 'success',
    message: 'Category updated',
    category,
  })
})

// @desc Delete category
// @route DELETE /api/v1/categories/:id
// @access Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id)
  res.json({
    status: 'success',
    message: 'Category deleted',
  })
})

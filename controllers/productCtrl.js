import Product from '../models/ProductModel.js'
import asyncHandler from 'express-async-handler'
import Category from './../models/CategoryModel.js'
import Brand from '../models/BrandModel.js'

// @desc Create new product
// @route POST /api/v1/products
// @access Private/Admin

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, sizes, colors, price, totalQty, brand } =
    req.body

  // check if product exist
  const productExist = await Product.findOne({ name })
  if (productExist) {
    throw new Error('Product already exists')
  }

  // find category
  const categoryFound = await Category.findOne({ name: category })

  //   check if category exist
  if (!categoryFound) {
    throw new Error('Category not found')
  }

  // find brand
  const brandFound = await Brand.findOne({ name: brand?.toLowerCase() })

  //   check if brand exist
  if (!brandFound) {
    throw new Error('Brand not found')
  }

  // create product
  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    price,
    totalQty,
    user: req.userAuthId,
    brand,
  })

  //   push product to category
  categoryFound.products.push(product._id)
  // resave
  await categoryFound.save()

  //   push product to brand
  brandFound.products.push(product._id)
  // resave
  await brandFound.save()

  res.json({
    status: 'success',
    message: 'Product created successfully',
    product,
  })
})

// @desc Get all products
// @route GET /api/v1/products
// @access Public
export const getProducts = asyncHandler(async (req, res) => {
  // query
  let productQuery = Product.find()
  //   search by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: 'i' },
    })
  }

  //   filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: 'i' },
    })
  }

  //   filter by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: 'i' },
    })
  }

  //   filter by color
  if (req.query.colors) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.colors, $options: 'i' },
    })
  }

  //   filter by sizes
  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: 'i' },
    })
  }

  //   filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split('-')
    productQuery = productQuery.find({
      price: {
        $gte: priceRange[0],
        $lte: priceRange[1],
      },
    })
  }

  //   pagination
  //   page
  const page = parseInt(req.query.page) || 1
  //   limit
  const limit = parseInt(req.query.limit) || 10
  //   start index
  const startIndex = (page - 1) * limit
  //   end index
  const endIndex = page * limit
  //   total
  const total = await Product.countDocuments()

  productQuery = productQuery.skip(startIndex).limit(limit)

  //   pagination result
  const pagination = {}
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  //   await query
  const products = await productQuery.populate('reviews')
  res.json({
    status: 'success',
    total,
    results: products.length,
    pagination,
    message: 'Products fetched',
    products,
  })
})

// @desc get single product
// @route GET /api/v1/products/:id
// @access Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews')
  if (!product) {
    throw new Error('Product not found')
  }
  res.json({
    status: 'success',
    message: 'Product fetched',
    product,
  })
})

// @desc Update product
// @route PUT /api/v1/products/:id
// @access Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    price,
    user,
    totalQty,
    brand,
  } = req.body

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      price,
      user,
      totalQty,
      brand,
    },
    { new: true }
  )
  res.json({
    status: 'success',
    message: 'Product updated',
    product,
  })
})

// @desc Delete product
// @route DELETE /api/v1/products/:id
// @access Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({
    status: 'success',
    message: 'Product deleted',
  })
})

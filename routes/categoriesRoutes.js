import express from 'express'
import { isLoggedIn } from './../middlewares/isLoggedIn.js'
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from '../controllers/categoryCtrl.js'
import categoryFileUpload from '../config/categoryUpload.js'
const categoryRoutes = express.Router()

categoryRoutes.post(
  '/',
  isLoggedIn,
  categoryFileUpload.single('file'),
  createCategory
)
categoryRoutes.get('/', getAllCategories)
categoryRoutes.get('/:id', getSingleCategory)
categoryRoutes.put('/:id', isLoggedIn, updateCategory)
categoryRoutes.delete('/:id', isLoggedIn, deleteCategory)

export default categoryRoutes

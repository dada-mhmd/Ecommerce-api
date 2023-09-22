import express from 'express'
import { isLoggedIn } from './../middlewares/isLoggedIn.js'
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
} from './../controllers/brandCtrl.js'
import isAdmin from '../middlewares/isAdmin.js'

const brandRoutes = express.Router()

brandRoutes.post('/', isLoggedIn, isAdmin, createBrand)
brandRoutes.get('/', getAllBrands)
brandRoutes.get('/:id', getSingleBrand)
brandRoutes.put('/:id', isLoggedIn, isAdmin, updateBrand)
brandRoutes.delete('/:id', isLoggedIn, isAdmin, deleteBrand)

export default brandRoutes

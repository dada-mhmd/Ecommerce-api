import express from 'express'
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
} from '../controllers/couponCtrl.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'
import isAdmin from '../middlewares/isAdmin.js'

const couponRoutes = express.Router()

couponRoutes.post('/', isLoggedIn, isAdmin, createCoupon)
couponRoutes.get('/', getAllCoupons)
couponRoutes.get('/:id', getCoupon)
couponRoutes.put('/update/:id', isLoggedIn, isAdmin, updateCoupon)
couponRoutes.delete('/delete/:id', isLoggedIn, isAdmin, deleteCoupon)

export default couponRoutes

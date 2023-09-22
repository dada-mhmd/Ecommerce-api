import express from 'express'
import {
  createOrder,
  getAllOrders,
  getOrderStatistics,
  getSingleOrder,
  updateOrder,
} from '../controllers/OrderCtrl.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'

const orderRoutes = express.Router()

orderRoutes.post('/', isLoggedIn, createOrder)
orderRoutes.get('/', isLoggedIn, getAllOrders)
orderRoutes.get('/sales/stats', isLoggedIn, getOrderStatistics)
orderRoutes.put('/update/:id', isLoggedIn, updateOrder)
orderRoutes.get('/:id', isLoggedIn, getSingleOrder)

export default orderRoutes

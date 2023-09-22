import express from 'express'
import { isLoggedIn } from './../middlewares/isLoggedIn.js'
import { createReview } from '../controllers/ReviewCtrl.js'

const reviewRoutes = express.Router()

reviewRoutes.post('/:productID', isLoggedIn, createReview)

export default reviewRoutes

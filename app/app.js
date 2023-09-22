import express from 'express'
import dotenv from 'dotenv'
import dbConnect from '../config/dbConnect.js'
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js'
import userRoutes from '../routes/usersRoute.js'
import productRoutes from '../routes/productRoutes.js'
import categoryRoutes from '../routes/categoriesRoutes.js'
import brandRoutes from '../routes/brandRoutes.js'
import colorRoutes from '../routes/colorRoutes.js'
import reviewRoutes from '../routes/reviewRoutes.js'
import orderRoutes from '../routes/ordersRoutes.js'
import couponRoutes from '../routes/couponRoutes.js'
import Order from '../models/OrderModel.js'

import Stripe from 'stripe'

dotenv.config()
dbConnect()

const app = express()

// stripe webhook
const stripe = new Stripe(process.env.STRIPE_KEY)
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  'whsec_6844bb05757957c13e346cfdcb1afe23db711a65af44990b5c1b19a8df907085'

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature']

    let event

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret)
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    // Handle the event
    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     const paymentIntentSucceeded = event.data.object
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`)
    // }

    if (event.type === 'checkout.session.completed') {
      // update the  order
      const session = event.data.object
      const { orderId } = session.metadata
      const paymentStatus = session.payment_status
      const paymentMethod = session.payment_method_types[0]
      const totalAmount = session.amount_total
      const currency = session.currency
      // find the order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        { new: true }
      )
    } else {
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send()
  }
)

// middlewares
app.use(express.json())

// routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/brands', brandRoutes)
app.use('/api/v1/colors', colorRoutes)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/coupons', couponRoutes)

// error middleware
app.use(notFound)
app.use(globalErrHandler)

export default app

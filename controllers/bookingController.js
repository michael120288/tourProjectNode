const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  //2) Create checkout session

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    mode: 'payment',
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            images: [`http://localhost:8001/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100,
        },
        // description: tour.summary,
        quantity: 1,

        //images: [`http://localhost:8001/img/tours/${tour.imageCover}`],
      },
    ],
  });
  //3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

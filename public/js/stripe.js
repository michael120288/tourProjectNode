import axios from 'axios';
import { showAlert } from './alerts';
//const stripe = Stripe('pk_test_51OJfmIGaqwRPILapHYYvCeb9sdtDXmoES76pi5gZeujyl9fQjEyuBkhlNrcebqTkCugUmed3HL47h6NVuC51To3A00JW5fhJSh')
const stripe = require('stripe')(
  'pk_test_51OJfmIGaqwRPILapHYYvCeb9sdtDXmoES76pi5gZeujyl9fQjEyuBkhlNrcebqTkCugUmed3HL47h6NVuC51To3A00JW5fhJSh',
);
// import {loadStripe} from '@stripe/stripe-js';

// const stripe = loadStripe('pk_test_51OJfmIGaqwRPILapHYYvCeb9sdtDXmoES76pi5gZeujyl9fQjEyuBkhlNrcebqTkCugUmed3HL47h6NVuC51To3A00JW5fhJSh');

export const bookTour = async (tourId) => {
  try {
    const session = await axios(
      `http://localhost:8001/api/v1/bookings/checkout-session/${tourId}`,
    );
    console.log(session);

    // 2) Create checkout form + change credit card
    stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.error(err);
    showAlert('error', err);
  }
};
// export const bookTour = async tourId => {
//     await axios(`http://localhost:8001/api/v1/bookings/checkout-session/${tourId}`)

//       .then(function(session) {
//         return stripe.redirectToCheckout({ sessionId: session.data.session.id});
//       })
//       .then(function(result) {
//         // If `redirectToCheckout` fails due to a browser or network
//         // error, you should display the localized error message to your
//         // customer using `error.message`.
//         if (result.error) {
//           alert(result.error.message);
//         }
//       });

// }

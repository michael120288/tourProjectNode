import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = await loadStripe('pk_test_51OJfmIGaqwRPILapHYYvCeb9sdtDXmoES76pi5gZeujyl9fQjEyuBkhlNrcebqTkCugUmed3HL47h6NVuC51To3A00JW5fhJSh');

export const bookTour = async (tourId) => {
  try {
    const session = await axios(
      `http://localhost:8001/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Redirect to Stripe Checkout
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.error(err);
    showAlert('error', err);
  }
};
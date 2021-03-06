const stripe = require("stripe")('sk_test_VePHdqKTYQjKNInc7u56JBrQ');

const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
  };

const PostCreatePaymentIntent = async (req) => {
    const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {clientSecret: paymentIntent.client_secret,};
}

module.exports = {
    PostCreatePaymentIntent
}
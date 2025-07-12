import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, email } = req.body;

    if (!amount || !email) {
      return res.status(400).json({ error: "Amount and email are required." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // cents
      currency: "usd",
      receipt_email: email,
      metadata: {
        purpose: "Charity Role Request",
        email,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,
    });
  } catch (err) {
    console.error("Stripe Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

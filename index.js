const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/initiate-payment', async (req, res) => {
  const { amount, email } = req.body;

  if (!amount || !email) {
    return res.status(400).json({ error: 'Missing amount or email' });
  }

  const payload = {
    store_id: 'patua685d01b8d4ca6',
    store_passwd: 'patua685d01b8d4ca6@ssl',
    total_amount: amount,
    currency: 'BDT',
    tran_id: `TXN_${Date.now()}`,
    success_url: 'https://sslc.onrender.com/success',
    fail_url: 'https://sslc.onrender.com/fail',
    cancel_url: 'https://sslc.onrender.com/cancel',
    emi_option: 0,
    cus_name: 'Customer',
    cus_email: email,
    cus_phone: '01700000000',
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_postcode: '1212',
    cus_country: 'Bangladesh',
    shipping_method: 'NO',
    num_of_item: 1,
    product_name: 'Subscription',
    product_category: 'Services',
  };

  try {
    const params = new URLSearchParams(payload).toString();

    const response = await axios.post(
      'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('SSLCOMMERZ response:', response.data);

    if (response.data?.status === 'SUCCESS') {
      return res.json({ GatewayPageURL: response.data.GatewayPageURL });
    } else {
      return res.status(400).json({
        error: 'Failed to generate payment URL',
        debug: response.data,
      });
    }
  } catch (error) {
    console.error('Payment initiation error:', error.message);
    return res.status(500).json({ error: 'Server error while initiating payment' });
  }
});

app.get('/success', (req, res) => {
  res.send('<h2>✅ Payment Successful</h2><p>You may close this window.</p>');
});

app.get('/fail', (req, res) => {
  res.send('<h2>❌ Payment Failed</h2><p>Please try again.</p>');
});

app.get('/cancel', (req, res) => {
  res.send('<h2>⚠️ Payment Cancelled</h2><p>Payment was cancelled.</p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

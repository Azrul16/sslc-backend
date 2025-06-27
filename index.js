const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from any origin (Flutter web)
app.use(express.json());

app.post('/initiate-payment', async (req, res) => {
  const { amount, email } = req.body;

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
    cus_name: 'Test User',
    cus_email: email,
    cus_phone: '01700000000',
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_postcode: '1212',
    cus_country: 'Bangladesh',
    shipping_method: 'NO',
    num_of_item: 1,
    product_name: 'Premium Access',
    product_category: 'Subscription',
  };

  try {
    const response = await axios.post(
      'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
      payload
    );

    if (response.data?.status === 'SUCCESS') {
      res.json({ GatewayPageURL: response.data.GatewayPageURL });
    } else {
      res.status(400).json({
        error: 'Failed to generate payment URL',
        debug: response.data,
      });
    }
  } catch (err) {
    console.error('Payment error:', err.message);
    res.status(500).json({ error: 'Server error while initiating payment.' });
  }
});

// Optional: simple confirmation pages for browser redirect
app.get('/success', (req, res) => {
  res.send('<h2>✅ Payment Successful</h2><p>You may now close this window.</p>');
});

app.get('/fail', (req, res) => {
  res.send('<h2>❌ Payment Failed</h2><p>Please try again later.</p>');
});

app.get('/cancel', (req, res) => {
  res.send('<h2>⚠️ Payment Cancelled</h2><p>You cancelled the payment process.</p>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

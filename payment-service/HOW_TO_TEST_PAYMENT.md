# Payment Testing - Step by Step

## ✅ Prerequisites
- Payment service running on `http://localhost:3005`
- Stripe test account (free)
- curl installed
- 5 minutes

---

## Step 1: Start Payment Service

```bash
cd payment-service
npm start
```

Wait for:
```
Payment Service running on port 3005
```

---

## Step 2: Generate Test IDs

In a **new terminal**:

```bash
cd payment-service
node gen-ids.js
```

**Copy the output:**
```
User ID: 69d4ef3c005fa9ac9e8b493f
Reference ID: 69d4ef3c005fa9ac9e8b4940
```

---

## Step 3: Generate Temporary JWT Token

Copy and run this in terminal (replace `USER_ID` from Step 2):

```bash
node -e "const jwt = require('jsonwebtoken'); const token = jwt.sign({ userId: '69d4ef3c005fa9ac9e8b493f', username: 'testuser' }, 'your_jwt_secret_key_here_change_in_production', { expiresIn: '1h' }); console.log(token);"
```

**Copy the token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQ0ZWYzYzAwNWZhOWFjOWU4YjQ5M2YiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNzc1NTYyNTk1LCJleHAiOjE3NzU1NjYxOTV9.l-ZairtZo5Jr8VUBMOHxUaeUbLObTWDgEomK3uzRF4E
```

---

## Step 4: Create Payment & Get Checkout URL

Copy and run this (replace `YOUR_TOKEN` and `YOUR_REFERENCE_ID`):

```bash
curl -X POST http://localhost:3005/api/payments/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"amount\":5000,\"paymentType\":\"appointment\",\"referenceId\":\"YOUR_REFERENCE_ID\",\"metadata\":{\"doctorId\":\"doc_001\"}}"
```

**Example with real values:**
```bash
curl -X POST http://localhost:3005/api/payments/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQ0ZWYzYzAwNWZhOWFjOWU4YjQ5M2YiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNzc1NTYyNTk1LCJleHAiOjE3NzU1NjYxOTV9.l-ZairtZo5Jr8VUBMOHxUaeUbLObTWDgEomK3uzRF4E" \
  -d "{\"amount\":5000,\"paymentType\":\"appointment\",\"referenceId\":\"69d4ef3c005fa9ac9e8b4940\",\"metadata\":{\"doctorId\":\"doc_001\"}}"
```

**You get response:**
```json
{
  "status": "success",
  "data": {
    "paymentId": "69d4ef6de7073fe654f9fbc6",
    "checkoutSessionId": "cs_test_a1z5zMZGpCWd2R5ypGebi23g5PzYcOTEGvTqLpA5ZYql9SsQdLMlM614yj",
    "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
    "amount": 5000,
    "currency": "usd"
  }
}
```

---

## Step 5: Open Checkout Page

Click or copy the **checkoutUrl** and open in browser:

```
https://checkout.stripe.com/c/pay/cs_test_...
```

---

## Step 6: Complete Test Payment

On Stripe checkout page (test card details):

 Card Number -> `4242 4242 4242 4242`
 Expiry date -> `12/25` |
 CVC -> `123` |

Click **Pay** →

---

## Step 7: Payment Complete! ✅

Browser redirects back. Your payment is **complete**!

**Check terminal:** You should see:
```
[Payment logs showing webhook received and processed]
```

---

## That's It! 🎉

You've successfully:
1. ✅ Generated a JWT token
2. ✅ Created a checkout session
3. ✅ Opened the Stripe payment page
4. ✅ Completed a test payment

---

## Quick Copy-Paste Summary

```bash
# Terminal 1: Start service
npm start

# Terminal 2: Generate IDs
node gen-ids.js
# Copy User ID and Reference ID

# Terminal 3: Generate token
node -e "const jwt = require('jsonwebtoken'); const token = jwt.sign({ userId: 'PASTE_USER_ID', username: 'testuser' }, 'your_jwt_secret_key_here_change_in_production', { expiresIn: '1h' }); console.log(token);"
# Copy token

# Terminal 3: Create checkout
curl -X POST http://localhost:3005/api/payments/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PASTE_TOKEN" \
  -d "{\"amount\":5000,\"paymentType\":\"appointment\",\"referenceId\":\"PASTE_REFERENCE_ID\",\"metadata\":{\"doctorId\":\"doc_001\"}}"
# Copy checkoutUrl

# Browser: Open checkoutUrl
# Use card: 4242 4242 4242 4242
# Click Pay
```

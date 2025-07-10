// src/app/api/mpesa/callback/route.js
export async function POST(request) {
  const callbackData = await request.json();
  console.log('STK Callback response:', JSON.stringify(callbackData));

  // Extract info from callback
  const stkCallback = callbackData.Body.stkCallback;

  // Always respond to Safaricom with a success to acknowledge receipt
  // res.json({ ResultCode: 0, ResultDesc: 'Accepted' });

  // Process the callback data as needed for your application
  if (stkCallback.ResultCode === 0) {
    // Payment successful
    const transactionDetails = stkCallback.CallbackMetadata.Item;
    // Process the successful payment
    console.log('Payment successful', transactionDetails);
    
    // In a real application, you would:
    // 1. Update your database
    // 2. Fulfill the order
    // 3. Notify the customer
    // etc.
  } else {
    // Payment failed
    console.log('Payment failed:', stkCallback.ResultDesc);
  }
  return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' }), { status: 200 });
}
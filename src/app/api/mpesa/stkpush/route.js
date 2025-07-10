// src/app/api/mpesa/stkpush/route.js
import { generateToken, getTimestamp } from "@/lib/mpesa";
import axios from "axios";

export async function POST(request) {
  try {
    const { phoneNumber, amount } = await request.json();

    const token = await generateToken();
    const timestamp = getTimestamp();
    const shortCode = process.env.MPESA_BUSINESS_SHORT_CODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackURL = process.env.NEXT_PUBLIC_CALLBACK_URL;

    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackURL,
      AccountReference: "Hostel Room Payment",
      TransactionDesc: "Payment for a hostel room",
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return new Response(JSON.stringify(response.data), { status: 200 });

  } catch (error) {
    console.error("STK Push Error:", error.response ? error.response.data : error.message);
    const errorMessage = error.response ? error.response.data.errorMessage : "An unexpected error occurred.";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
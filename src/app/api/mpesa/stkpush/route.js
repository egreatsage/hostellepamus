import { getAccessToken, getTimestamp } from "@/lib/mpesa";
import axios from "axios";
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";

export async function POST(request) {
  try {
    await dbConnect();

    const { phoneNumber, amount, bookingId } = await request.json();

    if (!phoneNumber || !amount || !bookingId) {
      return new Response(JSON.stringify({ error: 'Phone number, amount, and bookingId are required' }), { status: 400 });
    }

    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedPhone = `254${phoneNumber.slice(1)}`;
    } else if (phoneNumber.startsWith('+254')) {
      formattedPhone = phoneNumber.slice(1);
    }

    if (!/^254\d{9}$/.test(formattedPhone)) {
      return new Response(JSON.stringify({ error: 'Invalid Safaricom phone number format' }), { status: 400 });
    }

    const token = await getAccessToken();
    const timestamp = getTimestamp();
    const shortCode = process.env.MPESA_BUSINESS_SHORT_CODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackURL = process.env.NEXT_PUBLIC_CALLBACK_URL;

    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: shortCode,
      PhoneNumber: formattedPhone,
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

    // Save the CheckoutRequestID to the booking
    await Booking.findByIdAndUpdate(bookingId, {
      checkoutRequestId: response.data.CheckoutRequestID,
    });

    return new Response(JSON.stringify(response.data), { status: 200 });

  } catch (error) {
    console.error("STK Push Error:", error.response ? error.response.data : error.message);
    const errorMessage = error.response ? error.response.data.errorMessage : "An unexpected error occurred.";
    // **This is the critical fix:** Return a Response object in the catch block.
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
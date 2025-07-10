// src/lib/mpesa.js
import axios from "axios";

// Function to get the timestamp in YYYYMMDDHHmmss format
export const getTimestamp = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// Function to generate the password for STK Push
export const getPassword = (timestamp) => {
    const shortCode = process.env.BUSINESS_SHORT_CODE;
    const passKey = process.env.PASS_KEY;
    const password = `${shortCode}${passKey}${timestamp}`;
    return Buffer.from(password).toString('base64');
};

// Function to get the M-Pesa API access token
export const getAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Basic ${auth}`,
        }
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to generate token:", error);
    throw new Error("Failed to generate access token");
  }
};
const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

export const paypal = {
  createOrder: async function createOrder(price: number) {
    const accessToken = await generateAccesToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: price,
            },
          },
        ],
      }),
    });
    return await handleResponse(response);
  },
  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generateAccesToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return await handleResponse(response);
  },
};

async function generateAccesToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_APP_SECRET).toString(
    'base64'
  );

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  const jsonData = await handleResponse(response); // Await the handleResponse function call
  return jsonData.access_token;
}

async function handleResponse(response: any) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}

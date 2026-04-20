const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { session_id } = JSON.parse(event.body || '{}');
    if (!session_id) {
      return { statusCode: 400, headers, body: JSON.stringify({ paid: false, error: 'Missing session_id' }) };
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      return { statusCode: 200, headers, body: JSON.stringify({ paid: true }) };
    } else {
      return { statusCode: 200, headers, body: JSON.stringify({ paid: false }) };
    }
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ paid: false, error: err.message }) };
  }
};

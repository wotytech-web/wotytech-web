const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Permitir CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const { items } = JSON.parse(event.body);
    
    // Llamar a la API de Mercado Pago con tus credenciales
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer APP_USR-2519012086152007-111221-6e71aed2c0c16f81de976cafad94a184-2986635467'
      },
      body: JSON.stringify({
        items: items,
        back_urls: {
          success: 'https://wotytech.netlify.app/?status=success',
          failure: 'https://wotytech.netlify.app/?status=failure',
          pending: 'https://wotytech.netlify.app/?status=pending'
        },
        auto_return: 'approved',
        statement_descriptor: 'WOTYTECH',
        external_reference: 'WOTYTECH-' + Date.now()
      })
    });

    const data = await response.json();

    if (data.init_point) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          init_point: data.init_point,
          preference_id: data.id
        })
      };
    } else {
      throw new Error('No se pudo crear la preferencia');
    }

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};
// api/create_preference.js
// Esta es la función de servidor (Backend) que se ejecuta en Vercel.
// Su función es contactar a Mercado Pago con credenciales privadas para generar el link de pago.

// Importa el SDK de Mercado Pago
const mercadopago = require('mercadopago');

// --- CONFIGURACIÓN DE CREDENCIALES (¡CRÍTICO!) ---

// 1. Obtén tu "Access Token" de Mercado Pago.
// Por seguridad, usaremos una variable de entorno de Vercel (MP_ACCESS_TOKEN).
// Usar process.env.MP_ACCESS_TOKEN es la forma segura.
const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

// 2. Configura el SDK con tu Access Token.
if (ACCESS_TOKEN) {
    mercadopago.configure({
        access_token: ACCESS_TOKEN
    });
} else {
    console.error("ERROR: La variable de entorno MP_ACCESS_TOKEN no está configurada.");
}


// Función principal que maneja la solicitud de tu tienda (el frontend)
module.exports = async (req, res) => {
    // 1. Verifica que la solicitud sea POST y que el token esté configurado
    if (req.method !== 'POST') {
        return res.status(405).send('Método no permitido. Usa POST.');
    }
    if (!ACCESS_TOKEN) {
        return res.status(500).json({ 
            error: "Credenciales de Mercado Pago no configuradas en el servidor." 
        });
    }

    try {
        // 2. Extrae los items del cuerpo de la solicitud (el carrito)
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "No se proporcionaron items en el carrito." });
        }
        
        // 3. Prepara la estructura de datos para la API de Mercado Pago
        let preference = {
            items: items.map(item => ({
                title: item.title,
                unit_price: item.unit_price, // Precio unitario
                quantity: item.quantity,    // Cantidad
            })),
            
            // Define a dónde debe regresar el usuario después de pagar
            back_urls: {
                success: `${process.env.VERCEL_URL}/success`, // URL de éxito
                failure: `${process.env.VERCEL_URL}/failure`, // URL de fallo
                pending: `${process.env.VERCEL_URL}/pending`  // URL de pago pendiente
            },
            auto_return: "approved", // Redirigir automáticamente al éxito si el pago es aprobado
        };

        // 4. Crea la preferencia de pago en Mercado Pago
        const mp_response = await mercadopago.preferences.create(preference);
        
        // 5. Envía la respuesta al frontend (App.jsx)
        // El frontend necesita el 'id' y el link de pago (sandbox_init_point para pruebas)
        const responseData = {
            id: mp_response.body.id,
            // Usa 'init_point' para producción, pero 'sandbox_init_point' es mejor para pruebas iniciales.
            external_url: mp_response.body.sandbox_init_point || mp_response.body.init_point
        };

        return res.status(200).json(responseData);

    } catch (error) {
        console.error('Error al crear preferencia de Mercado Pago:', error);
        return res.status(500).json({ 
            error: 'Fallo interno del servidor al procesar el pago.', 
            details: error.message 
        });
    }
};

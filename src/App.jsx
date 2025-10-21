import React, { useState } from "react";

// URL base de tu tienda desplegada en Vercel
// Vercel usará esta URL para llamar a la función 'api/create_preference'
const BASE_URL = window.location.origin;

export default function App() {
  const [cart, setCart] = useState([]);
  const [checkout, setCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null); // ID de la preferencia de MP

  // Lista de productos disponibles en la tienda
  const products = [
    { id: 1, name: "Carta Pikachu", price: 3000 },
    { id: 2, name: "Carta Charizard", price: 10000 },
    { id: 3, name: "Carta Eevee", price: 2500 }
  ];

  // Agrega un producto al carrito
  const addToCart = (p) => setCart([...cart, p]);

  // Crea una preferencia de pago en Mercado Pago
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    setCheckout(false);
    setPreferenceId(null);
    
    // 1. Prepara los datos del carrito para enviarlos a la API
    // Mercado Pago espera un formato específico (título, cantidad, precio unitario)
    const items = cart.map(item => ({
      title: item.name,
      unit_price: item.price,
      quantity: 1, // Asume 1 unidad de cada carta
    }));

    try {
      // 2. Llama a la función API que crearemos
      const response = await fetch(`${BASE_URL}/api/create_preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();
      
      if (data.id) {
        // 3. Obtiene el ID de preferencia y redirige a Mercado Pago
        setPreferenceId(data.id);
        const externalLink = data.external_url;
        
        // Redirige al usuario al checkout de Mercado Pago
        window.location.href = externalLink; 

      } else {
        alert("Error al crear la preferencia de pago. Revisa las credenciales.");
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("Ocurrió un error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: '600px', margin: '0 auto' }}>
      <h1>🛒 Onistore - Tienda Pokémon</h1>
      <h2>Cartas disponibles</h2>
      
      {products.map((p) => (
        <div key={p.id} style={productStyle}>
          <span>{p.name} - ${p.price}</span>
          <button 
            onClick={() => addToCart(p)}
            style={buttonStyle}
          >
            Agregar
          </button>
        </div>
      ))}

      <hr style={{ margin: '20px 0' }} />
      
      <h2>Carrito ({cart.length})</h2>
      
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        cart.map((c, i) => (
          <div key={i} style={{ marginBottom: '5px' }}>{c.name} - ${c.price}</div>
        ))
      )}

      {/* Botón para iniciar el proceso de pago */}
      <button 
        onClick={handleCheckout}
        disabled={cart.length === 0 || loading}
        style={checkoutButtonStyle(cart.length === 0 || loading)}
      >
        {loading ? 'Cargando pago...' : 'Pagar con Mercado Pago'}
      </button>

      {/* Si hay un error, se puede mostrar aquí */}
      {preferenceId === false && <p style={{ color: 'red', marginTop: '10px' }}>Error de conexión con Mercado Pago.</p>}
    </div>
  );
}

// Estilos básicos (CSS-in-JS)
const productStyle = {
  marginBottom: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px',
  border: '1px solid #eee',
  borderRadius: '4px',
};

const buttonStyle = {
  marginLeft: '15px',
  padding: '5px 10px',
  backgroundColor: '#009ee3', // Color de Mercado Pago
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const checkoutButtonStyle = (disabled) => ({
  padding: '10px 20px',
  backgroundColor: disabled ? '#ccc' : '#009ee3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  marginTop: '15px',
  fontWeight: 'bold',
  transition: 'background-color 0.2s',
});

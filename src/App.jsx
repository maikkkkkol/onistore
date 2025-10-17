import React, { useState } from "react";

export default function App() {
  const [cart, setCart] = useState([]);
  const [checkout, setCheckout] = useState(false);

  const products = [
    { id: 1, name: "Carta Pikachu", price: 3000 },
    { id: 2, name: "Carta Charizard", price: 10000 },
    { id: 3, name: "Carta Eevee", price: 2500 }
  ];

  const addToCart = (p) => setCart([...cart, p]);

  const handleCheckout = async () => {
    alert("Aquí se conectará con Mercado Pago y Transferencia pronto 💳");
    setCheckout(true);
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>🛒 Onistore - Tienda Pokémon</h1>
      <h2>Cartas disponibles</h2>
      {products.map((p) => (
        <div key={p.id}>
          {p.name} - ${p.price}
          <button onClick={() => addToCart(p)}>Agregar</button>
        </div>
      ))}

      <hr />
      <h2>Carrito ({cart.length})</h2>
      {cart.map((c, i) => (
        <div key={i}>{c.name} - ${c.price}</div>
      ))}

      <button onClick={handleCheckout}>Proceder al pago</button>

      {checkout && (
        <div>
          <h3>Métodos de pago</h3>
          <button onClick={() => alert("Simular pago con Mercado Pago")}>
            Pagar con Mercado Pago
          </button>
          <button onClick={() => alert("Simular pago por transferencia")}>
            Pagar por transferencia
          </button>
        </div>
      )}
    </div>
  );
}



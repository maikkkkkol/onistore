import React, { useState, useEffect } from 'react';
import { ShoppingCart, Zap, CreditCard, ArrowLeft, Trash2 } from 'lucide-react';

// --- SIMULACIÓN DE DATOS DE PRODUCTOS ---
// En una app real, esto vendría de una API (como la PokéAPI)
const POKEMON_PRODUCTS = [
  { id: 1, name: "Pikachu", price: 10.00, imageUrl: "https://placehold.co/100x100/FFF/333?text=Pika", type: "Electric" },
  { id: 4, name: "Charmander", price: 15.00, imageUrl: "https://placehold.co/100x100/FFF/333?text=Char", type: "Fire" },
  { id: 7, name: "Squirtle", price: 12.50, imageUrl: "https://placehold.co/100x100/FFF/333?text=Squir", type: "Water" },
  { id: 25, name: "Jigglypuff", price: 8.00, imageUrl: "https://placehold.co/100x100/FFF/333?text=Jiggly", type: "Normal" },
];

// Función utilitaria para formatear el precio
const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};

// ----------------------------------------------------------------------
// 1. Componente: Lista de Productos (La Tienda)
// ----------------------------------------------------------------------
const ProductList = ({ onAddToCart }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {POKEMON_PRODUCTS.map(pokemon => (
      <div 
        key={pokemon.id} 
        className="bg-gray-50 p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center border border-indigo-100"
      >
        <img 
          src={pokemon.imageUrl} 
          alt={pokemon.name} 
          className="w-24 h-24 mb-3 rounded-full object-cover border-4 border-yellow-400" 
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/E0F2FE/1E40AF?text=Poke"}}
        />
        <h3 className="text-xl font-bold text-indigo-700">{pokemon.name}</h3>
        <p className="text-gray-600 mb-4">{pokemon.type}</p>
        <p className="text-2xl font-extrabold text-green-600 mb-4">
          {formatCurrency(pokemon.price)}
        </p>
        <button
          onClick={() => onAddToCart(pokemon)}
          className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
        >
          <ShoppingCart className="w-5 h-5"/>
          <span>Añadir al Carrito</span>
        </button>
      </div>
    ))}
  </div>
);

// ----------------------------------------------------------------------
// 2. Componente: Carrito de Compras
// ----------------------------------------------------------------------
const CartView = ({ cart, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.15; // Impuesto simulado del 15%
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes;

  if (cart.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-xl shadow-inner">
        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
        <p className="text-xl text-gray-500">Tu carrito está vacío. ¡Añade algunos Pokémon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
            <div className="flex items-center space-x-4">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-10 h-10 rounded-full object-cover" 
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/E0F2FE/1E40AF?text=P"}}
              />
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">{formatCurrency(item.price)} c/u</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Controles de cantidad */}
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                className="w-16 p-2 border rounded-lg text-center focus:ring-indigo-500 focus:border-indigo-500"
              />
              
              {/* Precio total por item */}
              <p className="font-bold text-gray-900 w-20 text-right">
                {formatCurrency(item.price * item.quantity)}
              </p>

              {/* Botón para eliminar */}
              <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700 transition duration-200">
                <Trash2 className="w-5 h-5"/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de Totales */}
      <div className="bg-indigo-50 p-6 rounded-xl shadow-lg space-y-2">
        <div className="flex justify-between text-lg text-gray-700">
          <span>Subtotal:</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-lg text-gray-700 border-b pb-2">
          <span>Impuestos (15%):</span>
          <span className="font-semibold">{formatCurrency(taxes)}</span>
        </div>
        <div className="flex justify-between text-2xl font-bold text-indigo-700 pt-2">
          <span>Total a Pagar:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Botón de Pago */}
      <button
        onClick={() => onCheckout(total)}
        className="w-full flex items-center justify-center space-x-2 py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-xl shadow-lg transition duration-200 transform hover:scale-[1.01]"
      >
        <CreditCard className="w-6 h-6"/>
        <span>Proceder al Pago</span>
      </button>
    </div>
  );
};

// ----------------------------------------------------------------------
// 3. Componente: Pantalla de Pago (Simulación)
// ----------------------------------------------------------------------
const CheckoutView = ({ total, onGoBackToShop }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'error'

  const handlePayment = () => {
    setIsProcessing(true);
    setPaymentStatus(null);

    // --- SIMULACIÓN DE PROCESAMIENTO DE PAGO ---
    // En un entorno real, aquí se llamaría a una API de pago (Stripe, etc.)
    setTimeout(() => {
      setIsProcessing(false);
      // Simular un pago exitoso el 90% de las veces
      if (Math.random() < 0.9) {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('error');
      }
    }, 2000); // Esperar 2 segundos
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-auto space-y-6 text-center">
      <h2 className="text-3xl font-bold text-indigo-700">Finalizar Compra</h2>
      <p className="text-xl text-gray-700">Total: <span className="text-4xl font-extrabold text-green-600">{formatCurrency(total)}</span></p>

      {paymentStatus === 'success' && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
          <p className="font-bold">¡Pago Exitoso!</p>
          <p>Tu pedido de Pokémon ha sido procesado. ¡Gracias por tu compra!</p>
        </div>
      )}

      {paymentStatus === 'error' && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error en el Pago</p>
          <p>Lo sentimos, hubo un problema. Por favor, intenta de nuevo.</p>
        </div>
      )}

      {paymentStatus === null && (
        <div className="space-y-4">
          <div className="p-6 bg-gray-50 rounded-lg border">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Método de Pago (Simulado)</h3>
            <div className="space-y-2 text-left">
              <input type="text" placeholder="Número de Tarjeta (XXXX-XXXX-...)" className="w-full p-2 border rounded-lg"/>
              <div className="flex space-x-2">
                <input type="text" placeholder="MM/AA" className="w-1/2 p-2 border rounded-lg"/>
                <input type="text" placeholder="CVV" className="w-1/2 p-2 border rounded-lg"/>
              </div>
            </div>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-xl font-bold rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Zap className="w-5 h-5 animate-pulse"/>
                <span>Procesando...</span>
              </>
            ) : (
              <span>Confirmar y Pagar</span>
            )}
          </button>
        </div>
      )}

      <button
        onClick={onGoBackToShop}
        className="mt-4 flex items-center justify-center space-x-2 text-indigo-500 hover:text-indigo-700 transition duration-200"
      >
        <ArrowLeft className="w-4 h-4"/>
        <span>Volver a la tienda</span>
      </button>
    </div>
  );
};

// ----------------------------------------------------------------------
// 4. Componente Raíz: App
// ----------------------------------------------------------------------
const App = () => {
  // Estado para el carrito: [{ id, name, price, quantity, ... }]
  const [cart, setCart] = useState([]);
  // Estado para la vista: 'shop', 'cart', 'checkout'
  const [currentView, setCurrentView] = useState('shop');
  const [checkoutTotal, setCheckoutTotal] = useState(0);

  // Calcula el número total de items únicos en el carrito
  const cartItemCount = cart.length;

  // 1. Añadir Pokémon al Carrito
  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si ya existe, incrementa la cantidad
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si es nuevo, añádelo con cantidad 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // 2. Actualizar Cantidad en el Carrito
  const handleUpdateQuantity = (id, quantity) => {
    setCart(prevCart => {
      if (quantity < 1) return prevCart; // Evitar cantidades negativas/cero
      return prevCart.map(item =>
        item.id === id
          ? { ...item, quantity: quantity }
          : item
      );
    });
  };

  // 3. Eliminar Item del Carrito
  const handleRemoveItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // 4. Proceder al Pago
  const handleCheckout = (total) => {
    setCheckoutTotal(total);
    setCurrentView('checkout');
  };
  
  // 5. Función para cambiar la vista y limpiar el carrito después de un pago exitoso
  const handleGoBackToShop = () => {
    // Si volvemos de checkout, asumimos que la compra finalizó, limpiamos el carrito
    if (currentView === 'checkout') {
        setCart([]);
    }
    setCurrentView('shop');
  };

  // 6. Función para renderizar el contenido según la vista actual
  const renderContent = () => {
    switch (currentView) {
      case 'shop':
        return <ProductList onAddToCart={handleAddToCart} />;
      case 'cart':
        return (
          <CartView 
            cart={cart} 
            onUpdateQuantity={handleUpdateQuantity} 
            onRemoveItem={handleRemoveItem} 
            onCheckout={handleCheckout} 
          />
        );
      case 'checkout':
        return <CheckoutView total={checkoutTotal} onGoBackToShop={handleGoBackToShop} />;
      default:
        return <ProductList onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-4 md:p-8 font-sans">
      
      {/* Encabezado Fijo y Barra de Navegación */}
      <header className="fixed top-0 left-0 right-0 bg-indigo-700 text-white shadow-xl z-10">
        <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
          <h1 
            className="text-2xl font-black cursor-pointer hover:text-yellow-300 transition duration-150"
            onClick={() => setCurrentView('shop')}
          >
            Pokémon Shop ⚡
          </h1>
          
          <div className="flex space-x-4">
            {/* Botón de Tienda */}
            <button
              onClick={() => setCurrentView('shop')}
              className={`p-2 rounded-full transition duration-150 ${currentView === 'shop' ? 'bg-indigo-800 text-yellow-300' : 'hover:bg-indigo-600'}`}
              title="Tienda"
            >
              <Zap className="w-6 h-6"/>
            </button>

            {/* Botón de Carrito */}
            <button
              onClick={() => setCurrentView('cart')}
              className={`relative p-2 rounded-full transition duration-150 ${currentView === 'cart' ? 'bg-indigo-800 text-yellow-300' : 'hover:bg-indigo-600'}`}
              title="Ver Carrito"
            >
              <ShoppingCart className="w-6 h-6"/>
              {/* Contador de items en el carrito */}
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-indigo-700">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-4xl mx-auto pt-24 pb-10">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
            {currentView === 'shop' && "Colecciona tus favoritos"}
            {currentView === 'cart' && "Tu Carrito de Captura"}
            {currentView === 'checkout' && "Proceso de Finalización"}
        </h2>
        
        {renderContent()}

      </main>
    </div>
  );
};

export default App;

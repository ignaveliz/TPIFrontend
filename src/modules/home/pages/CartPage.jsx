import { useState } from 'react';
import Header from '../shared/components/Header';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

// Datos de ejemplo
const mockCart = [
  { id: 1, name: 'Nombre de producto 1', price: 1500, quantity: 2 },
  { id: 2, name: 'Nombre de producto 2', price: 3000, quantity: 1 },
  { id: 3, name: 'Nombre de producto 3', price: 500, quantity: 5 },
];

function CartPage() {
  const [cartItems, setCartItems] = useState(mockCart);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleQuantity = (id, delta) => {
    setCartItems(current => current.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemove = (id) => {
    setCartItems(current => current.filter(item => item.id !== id));
  };

  return (
    <div className="h-full grid grid-cols-1 grid-rows-[auto_1fr] bg-gray-50">
      
      <Header />

      <div className="p-6 max-w-7xl mx-auto w-full">
        
        {/* VOLVEMOS A 3 COLUMNAS: 2 para productos, 1 para detalle */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA: Productos (Ocupa 2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="flex flex-col sm:flex-row justify-between items-center gap-4">
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  <div className="text-gray-500 mb-1">
                    Cantidad de productos: {item.quantity}
                  </div>
                  <div className="text-gray-500">
                    Sub Total: ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleQuantity(item.id, -1)}
                    className="font-bold text-xl px-2 text-gray-600 hover:text-black"
                  >
                    −
                  </button>
                  
                  <span className="border border-gray-300 rounded px-4 py-1 bg-white text-gray-700 min-w-[3rem] text-center">
                    {item.quantity}
                  </span>

                  <button 
                    onClick={() => handleQuantity(item.id, 1)}
                    className="font-bold text-xl px-2 text-gray-600 hover:text-black"
                  >
                    +
                  </button>

                  <Button 
                    variant="default"
                    className="ml-2"
                    onClick={() => handleRemove(item.id)}
                  >
                    Borrar
                  </Button>
                </div>
              </Card>
            ))}

            {cartItems.length === 0 && (
              <p className="text-center text-gray-500 mt-10">Tu carrito está vacío.</p>
            )}
          </div>

          {/* COLUMNA DERECHA: Detalle de pedido (Ocupa 1/3) */}
          <div className="lg:col-span-1">
            {/* CAMBIO CLAVE: h-[calc(100vh-8rem)] fuerza la altura vertical */}
            <Card className="h-[calc(100vh-8rem)] sticky top-4 flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-gray-900">Detalle de pedido</h2>
              
              <div className="flex flex-col gap-2 text-gray-600 text-lg">
                <p>Cantidad de en total: <span className="font-semibold text-gray-800">{totalItems}</span></p>
                <p>Total a pagar: <span className="font-semibold text-gray-800">${totalPrice.toLocaleString()}</span></p>
              </div>

              {/* mt-auto empuja este div hacia el fondo de la tarjeta */}
              <div className="mt-auto pt-4">
                <Button className="w-full py-3 text-lg">
                  Finalizar Compra
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CartPage;
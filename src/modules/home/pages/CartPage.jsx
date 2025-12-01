import { useState, useEffect } from 'react';
import Header from '../shared/components/Header';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function CartPage() {
  // 1. Inicializamos el estado leyendo la key "cart" del localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cart');

      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error al cargar el carrito:', error);

      return [];
    }
  });

  // 2. Guardamos en localStorage cada vez que cartItems cambia (al borrar o cambiar cantidad)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Cálculos totales usando 'currentUnitPrice'
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.currentUnitPrice * item.quantity), 0);

  const handleQuantity = (id, delta) => {
    setCartItems(current => current.map(item => {
      if (item.id === id) {
        // Evitamos que baje de 1 (para borrar usamos el botón borrar)
        const newQuantity = Math.max(1, item.quantity + delta);

        // Opcional: Si quieres validar contra el stock máximo disponible
        // const limitQuantity = Math.min(newQuantity, item.stockQuantity);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* COLUMNA IZQUIERDA: Productos */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="flex flex-col sm:flex-row justify-between items-center gap-4">

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>

                  {/* Mostramos el SKU o descripción si quieres */}
                  <p className="text-sm text-gray-400 mb-2">{item.description}</p>

                  <div className="text-gray-500 mb-1">
                    Precio unitario: ${item.currentUnitPrice.toLocaleString()}
                  </div>
                  <div className="text-gray-500 font-semibold">
                    Sub Total: ${(item.currentUnitPrice * item.quantity).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantity(item.id, -1)}
                    className="font-bold text-xl px-2 text-gray-600 hover:text-black disabled:opacity-30"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>

                  <span className="border border-gray-300 rounded px-4 py-1 bg-white text-gray-700 min-w-[3rem] text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleQuantity(item.id, 1)}
                    className="font-bold text-xl px-2 text-gray-600 hover:text-black"
                    // Podrías deshabilitar si superas el stock: disabled={item.quantity >= item.stockQuantity}
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
              <div className="text-center mt-10">
                <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: Resumen */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-8rem)] sticky top-4 flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-gray-900">Detalle de pedido</h2>

              <div className="flex flex-col gap-2 text-gray-600 text-lg">
                <p>Total de productos: <span className="font-semibold text-gray-800">{totalItems}</span></p>
                <div className="border-t pt-2 mt-2">
                  <p className="text-xl">Total a pagar: <span className="font-bold text-gray-900">${totalPrice.toLocaleString()}</span></p>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <Button className="w-full py-3 text-lg" disabled={cartItems.length === 0}>
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
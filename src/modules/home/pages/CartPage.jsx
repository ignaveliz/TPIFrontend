import { useState, useEffect } from 'react';
import Header from '../shared/components/Header';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

// 1. IMPORTACIONES NUEVAS
import Modal from '../../shared/components/Modal';
import LoginForm from '../../auth/components/LoginForm';
import useAuth from '../../auth/hook/useAuth';

import { createOrder } from '../../orders/services/createOrder';

function CartPage() {
  const { isAuthenticated, userID } = useAuth(); // Obtenemos el estado del usuario
  const [showLoginModal, setShowLoginModal] = useState(false); // Estado para controlar la modal

  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cart');

      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error al cargar el carrito:', error);

      return [];
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 2. EFECTO PARA ABRIR MODAL AUTOMÁTICAMENTE
  useEffect(() => {
    // Si NO está autenticado, abrimos la modal
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.currentUnitPrice * item.quantity), 0);

  const handleQuantity = (id, delta) => {
    setCartItems(current => current.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);

        return { ...item, quantity: newQuantity };
      }

      return item;
    }));
  };

  const handleRemove = (id) => {
    setCartItems(current => current.filter(item => item.id !== id));
  };

  const handleFinalizePurchase = async () => {
    // Verificación de seguridad extra al hacer click en el botón
    if (!isAuthenticated) {
      setShowLoginModal(true);

      return;
    }

    if (!userID) {
      alert('Error: No se encontró el usuario. Por favor inicia sesión.');

      return;
    }

    if (cartItems.length === 0) {
      alert('El carrito está vacío');

      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        userId: userID,
        items: cartItems,
      };

      await createOrder(orderData);

      setCartItems([]);
      console.log('¡Orden creada con éxito!');
      alert('Compra realizada con éxito');

    } catch (error) {
      console.error('Error al crear la orden:', error);
      alert('Hubo un error al procesar tu compra.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full grid grid-cols-1 grid-rows-[auto_1fr] bg-gray-50">

      {/* 3. RENDERIZADO DE LA MODAL */}
      {/* Al pasar onSuccess, el LoginForm se cerrará automáticamente al loguearse */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm onSuccess={() => setShowLoginModal(false)} />
      </Modal>

      <Header />

      <div className="p-6 max-w-7xl mx-auto w-full">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* COLUMNA IZQUIERDA: Productos */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
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
                    disabled={item.quantity <= 1 || isProcessing}
                  >
                    −
                  </button>

                  <span className="border border-gray-300 rounded px-4 py-1 bg-white text-gray-700 min-w-[3rem] text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleQuantity(item.id, 1)}
                    className="font-bold text-xl px-2 text-gray-600 hover:text-black disabled:opacity-30"
                    disabled={isProcessing}
                  >
                    +
                  </button>

                  <Button
                    variant="default"
                    className="ml-2"
                    onClick={() => handleRemove(item.id)}
                    disabled={isProcessing}
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
                <Button
                  className="w-full py-3 text-lg"
                  disabled={cartItems.length === 0 || isProcessing}
                  onClick={handleFinalizePurchase}
                >
                  {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
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
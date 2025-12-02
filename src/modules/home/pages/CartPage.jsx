import { useState, useEffect } from 'react';
import Header from '../shared/components/Header';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';
import LoginForm from '../../auth/components/LoginForm';
import useAuth from '../../auth/hook/useAuth';
import { createOrder } from '../../orders/services/createOrder';

function CartPage() {
  const { isAuthenticated, userID } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Estado del Carrito (Datos reales)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cart');

      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error al cargar el carrito:', error);

      return [];
    }
  });

  // Estado para el buscador
  const [searchTerm, setSearchTerm] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  // Lógica de Filtrado Visual (Solo afecta qué items se renderizan)
  const filteredCartItems = cartItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Cálculos basados en el carrito COMPLETO (cartItems), no en el filtrado
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
      // Se envía el carrito completo (cartItems), ignorando el filtro de búsqueda
      const orderData = {
        userId: userID,
        items: cartItems,
      };

      await createOrder(orderData);
      setCartItems([]);
      setSearchTerm(''); // Limpiar búsqueda al finalizar
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

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm onSuccess={() => setShowLoginModal(false)} />
      </Modal>

      {/* Pasamos searchTerm y setSearchTerm al Header para conectar el input */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* COLUMNA IZQUIERDA: Lista de Productos */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Mensaje si el carrito está vacío */}
            {cartItems.length === 0 ? (
              <div className="text-center mt-10">
                <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
              </div>
            ) : filteredCartItems.length === 0 ? (
              /* Mensaje si hay productos pero no coinciden con la búsqueda */
              <div className="text-center mt-10">
                <p className="text-gray-500 text-lg">No se encontraron productos con ese nombre.</p>
              </div>
            ) : (
              /* Mapeamos filteredCartItems para mostrar solo los resultados de búsqueda */
              filteredCartItems.map((item) => (
                <Card key={item.id} className="flex flex-col gap-4">
                  {/* Info Superior */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                    <div className="text-gray-500 text-sm space-y-1">
                      <p>Cantidad de productos: {item.quantity}</p>
                      <p>Sub Total: ${(item.currentUnitPrice * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Controles Inferiores */}
                  <div className="flex items-center justify-end gap-3 mt-2">
                    <button
                      onClick={() => handleQuantity(item.id, -1)}
                      className="font-bold text-xl px-2 text-gray-600 hover:text-black disabled:opacity-30"
                      disabled={item.quantity <= 1 || isProcessing}
                    >
                      −
                    </button>

                    <span className="border border-gray-300 rounded px-3 py-1 bg-white text-gray-700 min-w-[2.5rem] text-center text-sm">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => handleQuantity(item.id, 1)}
                      className="font-bold text-xl px-2 text-gray-600 hover:text-black disabled:opacity-30 mr-2"
                      disabled={isProcessing}
                    >
                      +
                    </button>

                    <Button
                      variant="default"
                      className="text-sm px-4 py-1.5"
                      onClick={() => handleRemove(item.id)}
                      disabled={isProcessing}
                    >
                      Borrar
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* COLUMNA DERECHA: Resumen (Se mantiene igual, mostrando totales reales) */}
          <div className="lg:col-span-1">
            <Card className="flex flex-col gap-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900">Detalle de pedido</h2>

              <div className="flex flex-col gap-2 text-gray-600 text-base">
                <p>Cantidad de en total: {totalItems}</p>
                <p>Total a pagar: <span className="font-semibold text-gray-800">${totalPrice.toLocaleString()}</span></p>
              </div>

              <div className="mt-2">
                <Button
                  className="w-full py-3 text-base font-bold bg-purple-200 hover:bg-purple-300 text-purple-900 rounded-xl"
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
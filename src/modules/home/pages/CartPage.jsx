import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import Header from '../shared/components/Header';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';
import LoginForm from '../../auth/components/LoginForm';
import RegisterForm from '../../auth/components/RegisterForm';
import useAuth from '../../auth/hook/useAuth';
import { createOrder } from '../../orders/services/createOrder';

function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated, userID } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // NUEVO ESTADO: Bandera para saber si hay una compra esperando login
  const [pendingPurchase, setPendingPurchase] = useState(false);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cart');

      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error al cargar el carrito:', error);

      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Persistencia del carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // CAMBIO: Se eliminó el useEffect que forzaba el login al montar el componente.
  // Ahora el usuario puede ver el carrito sin estar logueado.

  // NUEVO EFECTO: Detectar Login Exitoso para procesar orden pendiente
  useEffect(() => {
    // Si el usuario se autentica (isAuthenticated pasa a true) Y había una compra pendiente
    if (isAuthenticated && pendingPurchase) {
      processOrder(); // Ejecutar la orden automáticamente
      setPendingPurchase(false); // Resetear la bandera
    }
  }, [isAuthenticated, pendingPurchase]); // Dependencias clave

  const filteredCartItems = cartItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

  // Lógica centralizada para crear la orden
  const processOrder = async () => {
    if (cartItems.length === 0) return;

    setIsProcessing(true);
    try {
      // Nota: userID ya debe estar disponible gracias al Contexto actualizado
      const orderData = {
        userId: userID, // El ID viene del hook useAuth
        items: cartItems,
      };

      await createOrder(orderData);

      // Limpieza y Redirección
      setCartItems([]);
      localStorage.removeItem('cart'); // Aseguramos limpieza del storage
      setSearchTerm('');

      alert('Compra realizada con éxito');
      navigate('/'); // Redirigir al listado de productos

    } catch (error) {
      console.error('Error al crear la orden:', error);
      alert('Hubo un error al procesar tu compra.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalizePurchase = () => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío');

      return;
    }

    if (!isAuthenticated) {
      // FLUJO NO LOGUEADO:
      setPendingPurchase(true); // 1. Marcar intención de compra
      setShowLoginModal(true);  // 2. Abrir modal para que se loguee

      return;
    }

    // FLUJO LOGUEADO:
    processOrder();
  };

  return (
    <div className="h-full grid grid-cols-1 grid-rows-[auto_1fr] bg-gray-50">

      <Modal isOpen={showLoginModal} onClose={() => {
        setShowLoginModal(false);

        // Si cierra el modal sin loguearse, cancelamos la compra pendiente
        if (!isAuthenticated) setPendingPurchase(false);
      }}>
        <LoginForm onSuccess={() => setShowLoginModal(false)} />
      </Modal>

      <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)}>
        <RegisterForm onSuccess={() => setShowRegisterModal(false)} defaultRole="Usuario" />
      </Modal>

      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="text-center mt-10">
                <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
              </div>
            ) : filteredCartItems.length === 0 ? (
              <div className="text-center mt-10">
                <p className="text-gray-500 text-lg">No se encontraron productos con ese nombre.</p>
              </div>
            ) : (
              filteredCartItems.map((item) => (
                <Card key={item.id} className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                    <div className="text-gray-500 text-sm space-y-1">
                      <p>Cantidad de productos: {item.quantity}</p>
                      <p>Sub Total: ${(item.currentUnitPrice * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>

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
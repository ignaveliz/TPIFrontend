import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';
import LoginForm from '../../auth/components/LoginForm';
import RegisterForm from '../../auth/components/RegisterForm';
import useAuth from '../../auth/hook/useAuth';
import Cart from '../components/Cart';
import { createOrder } from '../../orders/services/createOrder';

function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated, userID } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (isAuthenticated && pendingPurchase) {
      processOrder();
      setPendingPurchase(false);
    }
  }, [isAuthenticated, pendingPurchase]);

  const filteredCartItems = cartItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.currentUnitPrice * item.quantity), 0);

  const handleQuantity = (id, delta) => {
    setCartItems(current => current.map(item => {
      if (item.id === id) {
        const proposedQuantity = item.quantity + delta;

        if (proposedQuantity < 1) return item;

        if (proposedQuantity > item.stockQuantity) return item;

        return { ...item, quantity: proposedQuantity };
      }

      return item;
    }));
  };

  const handleRemove = (id) => {
    setCartItems(current => current.filter(item => item.id !== id));
  };

  const processOrder = async () => {
    if (cartItems.length === 0) return;

    setIsProcessing(true);
    try {
      const orderData = {
        userId: userID,
        items: cartItems,
      };

      await createOrder(orderData);

      setCartItems([]);
      localStorage.removeItem('cart');
      setSearchTerm('');

      alert('Compra realizada con éxito');
      navigate('/');

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
      setPendingPurchase(true);
      setShowLoginModal(true);

      return;
    }

    processOrder();
  };

  return (
    <div className="h-full grid grid-cols-1 grid-rows-[auto_1fr] bg-gray-50">

      <Modal isOpen={showLoginModal} onClose={() => {
        setShowLoginModal(false);

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

      <Cart
        cartItems={cartItems}
        filteredCartItems={filteredCartItems}
        totalItems={totalItems}
        totalPrice={totalPrice}
        isProcessing={isProcessing}
        onUpdateQuantity={handleQuantity}
        onRemoveItem={handleRemove}
        onFinalizePurchase={handleFinalizePurchase}
      />
    </div>
  );
}

export default CartPage;
import Header from '../../shared/components/Header';
import Modal from '../../shared/components/Modal';
import LoginForm from '../../auth/components/LoginForm.jsx';
import RegisterForm from '../../auth/components/RegisterForm.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import { getAll } from '../../products/services/list.js';
import { useEffect, useState } from 'react';

function UserHomePage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getAll();

      if (error) throw error;

      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = async () => {
    console.log('Buscando:', searchTerm);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className='h-full grid grid-cols-1 grid-rows-[auto_1fr] bg-gray-50'>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm onSuccess={() => setShowLoginModal(false)} />
      </Modal>

      <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)}>
        <RegisterForm
          onSuccess={() => setShowRegisterModal(false)}
          defaultRole="Usuario"
        />
      </Modal>

      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        onLogin={() => setShowLoginModal(true)}
        onRegister={() => setShowRegisterModal(true)}
      />

      <ProductGrid
        loading={loading}
        products={filteredProducts}
        onLoginRequired={() => setShowLoginModal(true)}
      />
    </div>
  );
}

export default UserHomePage;
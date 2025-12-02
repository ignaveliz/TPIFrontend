import Card from '../../shared/components/Card.jsx';
import Header from '../shared/components/Header.jsx';
import ProductItem from '../shared/components/ProductItem.jsx';
import Modal from '../../shared/components/Modal.jsx'; // Importar Modal
import LoginForm from '../../auth/components/LoginForm.jsx'; // Importar LoginForm
import { getAll } from '../../products/services/list.js';
import { useEffect, useState } from 'react';

function UserHomePage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ESTADO PARA EL MODAL
  const [showLoginModal, setShowLoginModal] = useState(false);

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

      {/* --- MODAL DE LOGIN --- */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm onSuccess={() => setShowLoginModal(false)} />
      </Modal>

      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />

      <div className='grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-4 gap-6'>

        {loading ? (
          <span className="col-span-full text-center py-10">Cargando productos...</span>
        ) : filteredProducts.length === 0 ? (
          <span className="col-span-full text-center py-10 text-gray-500">No se encontraron productos.</span>
        ) : (
          filteredProducts.map((product, index) => {
            const positionInPattern = index % 6;
            const isWide = positionInPattern === 4 || positionInPattern === 5;

            return (
              <Card
                key={product.id}
                className={isWide ? 'sm:col-span-2' : ''}
              >
                <ProductItem
                  product={product}
                  imageAspect={isWide ? 'aspect-[2/1]' : 'aspect-square'}
                  // PASAMOS LA FUNCIÓN PARA ABRIR EL MODAL
                  onLoginRequired={() => setShowLoginModal(true)}
                />
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

export default UserHomePage;
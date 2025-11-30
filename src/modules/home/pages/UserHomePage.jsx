import Card from '../../shared/components/Card.jsx';
import Header from '../shared/components/Header.jsx';
import ProductItem from '../shared/components/ProductItem.jsx';
import { getAll } from '../../products/services/list.js';
import { useEffect, useState } from 'react';

function UserHomePage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
  }, [searchTerm]);

  const handleSearch = async () => {
    console.log('Buscando:', searchTerm);
  };

  return (
    <div className='h-full grid grid-cols-1 grid-rows-[auto_1fr] bg-gray-50'>

      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />

      {/* CONTENIDO PRINCIPAL */}
      <div className='grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-4 gap-6'>

        {loading ? (
          <span>Cargando productos...</span>
        ) : products.map((product, index) => {

          // LÓGICA DEL PATRÓN:
          // Obtenemos el residuo de dividir el índice por 6.
          // Esto nos dará siempre un número entre 0 y 5.
          const positionInPattern = index % 6;

          // Si el residuo es 4 o 5, es una de las "cartas anchas" de abajo
          const isWide = positionInPattern === 4 || positionInPattern === 5;

          return (
            <Card
              key={product.id}
              // Si es ancha, hacemos que ocupe 2 columnas
              className={isWide ? 'sm:col-span-2' : ''}
            >
              <ProductItem
                product={product}
                // Pasamos el aspecto correcto según si es ancha o no
                imageAspect={isWide ? 'aspect-[2/1]' : 'aspect-square'}
              />
            </Card>
          );
        })}

      </div>
    </div>
  );
}

export default UserHomePage;
import Card from '../../shared/components/Card.jsx';
import Header from '../shared/components/Header.jsx';
import ProductItem from '../shared/components/ProductItem.jsx';
import { getAll } from '../../products/services/list.js';
import { useEffect, useState } from 'react';

function UserHomePage() {

  const [products, setProducts] = useState([]); // "Base de datos" local
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

  // CAMBIO 1: El array de dependencias está vacío [].
  // Esto hace que la petición se ejecute SOLO UNA VEZ al montar el componente.
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = async () => {
    console.log('Buscando:', searchTerm);
  };

  // CAMBIO 2: Filtrado local
  // Creamos una nueva lista basada en lo que el usuario escribió.
  // Usamos toLowerCase() para que no importen las mayúsculas/minúsculas.
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className='h-full grid grid-cols-1 grid-rows-[auto_1fr] bg-gray-50'>

      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />

      {/* CONTENIDO PRINCIPAL */}
      <div className='grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-4 gap-6'>

        {loading ? (
          <span className="col-span-full text-center py-10">Cargando productos...</span>
        ) : filteredProducts.length === 0 ? (
        // Mensaje opcional si no hay coincidencias
          <span className="col-span-full text-center py-10 text-gray-500">No se encontraron productos.</span>
        ) : (
          // CAMBIO 3: Iteramos sobre 'filteredProducts' en lugar de 'products'
          filteredProducts.map((product, index) => {

            // La lógica del patrón se aplica sobre la lista FILTRADA.
            // Esto es bueno porque reordena el diseño dinámicamente.
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
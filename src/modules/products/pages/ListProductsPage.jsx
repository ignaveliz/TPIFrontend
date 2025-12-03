import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getProducts } from '../services/list';
import Pagination from '../../shared/components/Pagination';
import SearchBar from '../../shared/components/SearchBar';

const productStatus = {
  ALL: 'all',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
};

function ListProductsPage() {
  const navigate = useNavigate();

  const [ searchTerm, setSearchTerm ] = useState('');
  const [ status, setStatus ] = useState(productStatus.ALL);
  const [ pageNumber, setPageNumber ] = useState(1);
  const [ pageSize, setPageSize ] = useState(10);

  const [ total, setTotal ] = useState(0);
  const [ products, setProducts ] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProducts(searchTerm, status, pageNumber, pageSize);

      if (error) throw error;

      if (data) {
        setTotal(data.total || 0);
        setProducts(data.productItems || []);
      } else {
        setTotal(0);
        setProducts([]);
      }

    } catch (error) {
      console.error(error);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, status, pageSize, pageNumber]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  const handleSearch = async () => {
    await fetchProducts();
  };

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-3xl'>Productos</h1>

          <Button
            className='h-11 w-11 rounded-2xl sm:hidden flex items-center justify-center'
            onClick={() => navigate('/admin/products/create')}
          >
            <svg className="w-6 h-6" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 11C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5Z" fill="currentColor"></path>
              <path d="M9 5C9 4.44772 9.44772 4 10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5Z" fill="currentColor"></path>
            </svg>
          </Button>

          <Button
            className='hidden sm:block'
            onClick={() => navigate('/admin/products/create')}
          >
            Crear Producto
          </Button>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            placeholder="Buscar productos..."
            className="w-full"
          />
          <select
            onChange={evt => setStatus(evt.target.value == productStatus.ALL ? productStatus.ALL : evt.target.value == productStatus.ENABLED ? true : productStatus.DISABLED ? false : productStatus.DISABLED)}
            className='text-[1.3rem]'
          >
            <option value={productStatus.ALL}>Todos</option>
            <option value={productStatus.ENABLED}>Habilitados</option>
            <option value={productStatus.DISABLED}>Inhabilitados</option>
          </select>
        </div>
      </Card>

      <div className='mt-4 flex flex-col gap-4'>
        {
          loading
            ? <span className="text-center p-4">Buscando datos...</span>
            : products.length === 0
              ? (
                <Card className="text-center py-8 text-gray-500">
                  <p>No se encontraron productos.</p>
                </Card>
              )
              : products.map(product => (
                <Card key={product.sku}>
                  <h1>{product.sku} - {product.name}</h1>
                  <p className='text-base'>Stock: {product.stockQuantity} - ${product.currentUnitPrice} - {product.isActive ? 'Activado' : 'Desactivado'}</p>
                </Card>
              ))
        }
      </div>

      <Pagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNumber}
        onPageSizeChange={(newSize) => {
          setPageNumber(1);
          setPageSize(newSize);
        }}
      />
    </div>
  );
}

export default ListProductsPage;
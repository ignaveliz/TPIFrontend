import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { useEffect, useState } from 'react';
import { listOrders } from '../services/list';
import Pagination from '../../shared/components/Pagination';
import SearchBar from '../../shared/components/SearchBar';

const orderStatus = {
  ALL: 'all',
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

function ListOrdersPage() {
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ status, setStatus ] = useState(orderStatus.ALL);
  const [ pageNumber, setPageNumber ] = useState(1);
  const [ pageSize, setPageSize ] = useState(10);

  const [ total, setTotal ] = useState(0);
  const [ orders, setOrders ] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await listOrders(searchTerm, status, pageNumber, pageSize);

      if (error) throw error;

      setTotal(data.total);
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect( () => {
    fetchOrders();
  }, [searchTerm, status, pageNumber, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = async () => {
    await fetchOrders();
  };

  return (
    <>
      <div>
        <Card>
          <div
            className='flex justify-between items-center mb-3'
          >
            <h1 className='text-3xl'>Ordenes</h1>
          </div>
          <div className='flex flex-col sm:flex-row gap-4'>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              placeholder="Buscar ordenes..."
              className="w-full"
            />
            <select onChange={evt => setStatus(evt.target.value == orderStatus.ALL ? orderStatus.ALL : evt.target.value == orderStatus.PENDING ? orderStatus.PENDING : evt.target.value == orderStatus.PROCESSING ? orderStatus.PROCESSING : evt.target.value == orderStatus.SHIPPED ? orderStatus.SHIPPED : evt.target.value == orderStatus.DELIVERED ? orderStatus.DELIVERED : orderStatus.CANCELLED)} className='text-[1.3rem]'>
              <option value={orderStatus.ALL}>Todos</option>
              <option value={orderStatus.PENDING}>Pendientes</option>
              <option value={orderStatus.PROCESSING}>Procesando</option>
              <option value={orderStatus.SHIPPED}>Enviados</option>
              <option value={orderStatus.DELIVERED}>Entregados</option>
              <option value={orderStatus.CANCELLED}>Cancelados</option>
            </select>
          </div>
        </Card>

        <div className='mt-4 flex flex-col gap-4'>
          {
            loading
              ? <span>Buscando datos...</span>
              : orders.map((order, index) => {
                const displayNumber = (pageNumber - 1) * pageSize + index + 1;

                return (
                  <Card key={order.orderId}>
                    <h1>{displayNumber} - {order.customerName}</h1>
                    <p className='text-base'>Status: {order.status} - Total: ${order.totalAmount}</p>
                  </Card>
                );
              })

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
    </>

  );
};

export default ListOrdersPage;

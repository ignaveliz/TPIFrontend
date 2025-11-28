import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { useEffect, useState } from 'react';
import { listOrders } from '../services/list';

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
            <div
              className='flex items-center gap-3'
            >
              <input value={searchTerm} onChange={(evt) => setSearchTerm(evt.target.value)} type="text" placeholder='Buscar' className='text-[1.3rem] w-full' />
              <Button className='h-11 w-11' onClick={handleSearch}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              </Button>
            </div>
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

        <div className='flex justify-center items-center mt-3'>
          <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className='bg-gray-200 disabled:bg-gray-100'
          >
          Atras
          </button>
          <span>{pageNumber} / {totalPages}</span>
          <button
            disabled={ pageNumber === totalPages }
            onClick={() => setPageNumber(pageNumber + 1)}
            className='bg-gray-200 disabled:bg-gray-100'
          >
          Siguiente
          </button>

          <select
            value={pageSize}
            onChange={evt => {
              setPageNumber(1);
              setPageSize(Number(evt.target.value));
            }}
            className='ml-3'
          >
            <option value="2">2</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
    </>

  );
};

export default ListOrdersPage;

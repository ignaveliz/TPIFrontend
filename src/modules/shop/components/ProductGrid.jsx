import Card from '../../shared/components/Card';
import ProductItem from '../components/ProductItem';

function ProductGrid({ loading, products, onLoginRequired }) {
  return (
    <div className='grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
      {loading ? (
        <span className="col-span-full text-center py-10">Cargando productos...</span>
      ) : products.length === 0 ? (
        <span className="col-span-full text-center py-10 text-gray-500">
          No se encontraron productos.
        </span>
      ) : (
        products.map((product, index) => {
          const positionInPattern = index % 6;
          const isWide = positionInPattern === 4 || positionInPattern === 5;

          return (
            <Card
              key={product.id}
              className={isWide ? 'sm:col-span-2' : ''}
            >
              <ProductItem
                product={product}
                imageAspect={isWide ? 'aspect-square sm:aspect-[2/1]' : 'aspect-square'}
                onLoginRequired={onLoginRequired}
              />
            </Card>
          );
        })
      )}
    </div>
  );
}

export default ProductGrid;
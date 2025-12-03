import { useState, useEffect } from 'react';

function ProductItem({ imageAspect = 'aspect-square', product }) {
  const [quantity, setQuantity] = useState(1);
  const [qtyInCart, setQtyInCart] = useState(0);

  const getQtyInCart = () => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const item = storedCart.find(i => i.id === product.id);

      return item ? item.quantity : 0;
    } catch (error) {
      console.error('Error al obtener la cantidad en el carrito:', error);

      return 0;
    }
  };

  useEffect(() => {
    setQtyInCart(getQtyInCart());
  }, [product.id]);

  const availableStock = product.stockQuantity - qtyInCart;
  const isOutOfStock = availableStock <= 0;

  const handleIncrement = () => {
    setQuantity(prev => (prev < availableStock ? prev + 1 : prev));
  };

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const addToCart = () => {
    if (isOutOfStock) return;

    if (quantity > availableStock) {
      alert(`Solo quedan ${availableStock} unidades disponibles.`);

      return;
    }

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = storedCart.findIndex(item => item.id === product.id);

    if (existingProductIndex >= 0) {
      storedCart[existingProductIndex].quantity += quantity;
    } else {
      storedCart.push({ ...product, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(storedCart));
    console.log(`Se agregaron ${quantity} unidad(es) de ${product.name} al carrito.`);

    setQtyInCart(prev => prev + quantity);
    setQuantity(1);

  };

  return (
    <div className="flex flex-col h-full">

      <div>
        <div className={`w-full bg-gray-200 rounded-lg mb-3 ${imageAspect} flex items-center justify-center relative overflow-hidden`}>
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                {product.stockQuantity === 0 ? 'SIN STOCK' : 'EN CARRITO'}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-gray-700 font-medium text-sm mb-4">{product.name}</h3>
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between">
          <span className={`font-bold ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
            ${product.currentUnitPrice}
          </span>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                className="text-gray-500 hover:text-black font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={quantity <= 1 || isOutOfStock}
              >
                -
              </button>

              <span className={`text-sm border px-2 rounded bg-white w-8 text-center select-none ${isOutOfStock ? 'text-gray-300 bg-gray-50' : ''}`}>
                {isOutOfStock ? 0 : quantity}
              </span>

              <button
                onClick={handleIncrement}
                className="text-gray-500 hover:text-black font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={quantity >= availableStock || isOutOfStock}
              >
                +
              </button>
            </div>

            <button
              onClick={addToCart}
              disabled={isOutOfStock}
              className={`
                text-xs font-semibold px-3 py-1.5 rounded-md transition-colors 
                ${isOutOfStock
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : 'bg-purple-100 text-purple-700 hover:bg-purple-200 active:scale-95'
    }
              `}
            >
              {isOutOfStock ? 'Agotado' : 'Agregar'}
            </button>
          </div>
        </div>

        <div className="text-right mt-2 min-h-[1.25rem]">
          {isOutOfStock ? (
            <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded inline-block shadow-sm border border-red-100">
              {product.stockQuantity === 0 ? '¡Producto Agotado!' : '¡Stock en carrito!'}
            </span>
          ) : quantity >= availableStock ? (
            <span className="text-[10px] text-orange-500 font-medium">
              Stock máx. alcanzado
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
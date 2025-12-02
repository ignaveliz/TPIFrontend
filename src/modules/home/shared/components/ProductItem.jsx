import { useState } from 'react';
// Ya no necesitamos useAuth aquí para bloquear la acción

function ProductItem({ imageAspect = 'aspect-square', product }) {
  const [quantity, setQuantity] = useState(1);

  var maxStock = product.stockQuantity;

  const handleIncrement = () => {
    setQuantity(prev => (prev < maxStock ? prev + 1 : prev));
  };

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const addToCart = () => {
    // CAMBIO: Se eliminó la verificación if (!isAuthenticated)...
    // Ahora permite agregar al carrito libremente.

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = storedCart.findIndex(item => item.id === product.id);

    if (existingProductIndex >= 0) {
      storedCart[existingProductIndex].quantity += quantity;
    } else {
      storedCart.push({ ...product, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(storedCart));
    console.log(`Se agregaron ${quantity} unidad(es) de ${product.name} al carrito.`);

    // Feedback visual opcional: resetear cantidad
    setQuantity(1);
    alert('Producto agregado al carrito'); // Opcional: Feedback simple
  };

  return (
    <>
      <div className={`w-full bg-gray-200 rounded-lg mb-3 ${imageAspect} flex items-center justify-center`}>
        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <h3 className="text-gray-700 font-medium text-sm mb-4">{product.name}</h3>

      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-900">${product.currentUnitPrice}</span>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              className="text-gray-500 hover:text-black font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={quantity <= 1}
            >
              -
            </button>

            <span className="text-sm border px-2 rounded bg-white w-8 text-center select-none">
              {quantity}
            </span>

            <button
              onClick={handleIncrement}
              className="text-gray-500 hover:text-black font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={quantity >= maxStock}
            >
              +
            </button>
          </div>

          <button
            onClick={addToCart}
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors active:scale-95"
          >
            Agregar
          </button>
        </div>
      </div>

      {quantity >= maxStock && (
        <div className="text-[10px] text-red-500 text-right mt-1 font-medium">
          Stock máx.
        </div>
      )}
    </>
  );
}

export default ProductItem;
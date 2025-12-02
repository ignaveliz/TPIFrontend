import { useState } from 'react';

function ProductItem({ imageAspect = 'aspect-square', product }) {
  const [quantity, setQuantity] = useState(1);

  var maxStock = product.stockQuantity;
  // Validamos si el stock es 0
  const isOutOfStock = maxStock === 0;

  const handleIncrement = () => {
    setQuantity(prev => (prev < maxStock ? prev + 1 : prev));
  };

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const addToCart = () => {
    // Si no hay stock, no hacemos nada (seguridad extra)
    if (isOutOfStock) return;

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = storedCart.findIndex(item => item.id === product.id);

    if (existingProductIndex >= 0) {
      storedCart[existingProductIndex].quantity += quantity;
    } else {
      storedCart.push({ ...product, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(storedCart));
    console.log(`Se agregaron ${quantity} unidad(es) de ${product.name} al carrito.`);

    setQuantity(1);
    alert('Producto agregado al carrito');
  };

  return (
    <>
      <div className={`w-full bg-gray-200 rounded-lg mb-3 ${imageAspect} flex items-center justify-center relative overflow-hidden`}>
        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>

        {/* Etiqueta visual sobre la imagen (Opcional, para dar más énfasis) */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">SIN STOCK</span>
          </div>
        )}
      </div>

      <h3 className="text-gray-700 font-medium text-sm mb-4">{product.name}</h3>

      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-900">${product.currentUnitPrice}</span>

        <div className="flex items-center gap-2">
          {/* Controles de Cantidad */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              // Desactivar si es menor a 1 O si está Agotado
              className="text-gray-500 hover:text-black font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={quantity <= 1 || isOutOfStock}
            >
              -
            </button>

            <span className={`text-sm border px-2 rounded bg-white w-8 text-center select-none ${isOutOfStock ? 'text-gray-400' : ''}`}>
              {isOutOfStock ? 0 : quantity}
            </span>

            <button
              onClick={handleIncrement}
              // Desactivar si supera el stock O si está Agotado
              className="text-gray-500 hover:text-black font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={quantity >= maxStock || isOutOfStock}
            >
              +
            </button>
          </div>

          {/* Botón Agregar */}
          <button
            onClick={addToCart}
            disabled={isOutOfStock}
            className={`
              text-xs font-semibold px-3 py-1.5 rounded-md transition-colors 
              ${isOutOfStock
      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' // Estilo deshabilitado
      : 'bg-purple-100 text-purple-700 hover:bg-purple-200 active:scale-95' // Estilo normal
    }
            `}
          >
            {isOutOfStock ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>

      {/* Mensajes de Estado del Stock */}
      <div className="text-right mt-1 h-4"> {/* Altura fija para evitar saltos */}
        {isOutOfStock ? (
          <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">
            Producto Agotado
          </span>
        ) : quantity >= maxStock ? (
          <span className="text-[10px] text-orange-500 font-medium">
            Stock máx. alcanzado
          </span>
        ) : null}
      </div>
    </>
  );
}

export default ProductItem;
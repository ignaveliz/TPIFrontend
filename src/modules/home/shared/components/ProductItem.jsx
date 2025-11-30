import { useState } from 'react';

function ProductItem({ imageAspect = 'aspect-square', product }) {
  const [quantity, setQuantity] = useState(1);

  // Asumimos que la propiedad se llama 'stock'.
  // Si tu backend la llama diferente, cámbialo aquí.
  const maxStock = product.stockQuantity;

  const handleIncrement = () => {
    setQuantity(prev => {
      // Solo sumamos si el valor actual es menor al stock disponible
      if (prev < maxStock) return prev + 1;

      return prev; // Si ya llegamos al máximo, no hacemos nada
    });
  };

  const handleDecrement = () => {
    setQuantity(prev => {
      // El mínimo sigue siendo 1
      if (prev > 1) return prev - 1;

      return 1;
    });
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

          {/* CONTROLES DE CANTIDAD */}
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
              // Deshabilitamos si la cantidad actual iguala o supera el stock
              className="text-gray-500 hover:text-black font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={quantity >= maxStock}
            >
              +
            </button>
          </div>

          <button className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors">
            Agregar
          </button>
        </div>
      </div>

      {/* (Opcional) Mensaje visual si no hay stock suficiente para agregar más */}
      {quantity >= maxStock && (
        <div className="text-[10px] text-red-500 text-right mt-1 font-medium">
          Máx. stock alcanzado
        </div>
      )}
    </>
  );
}

export default ProductItem;
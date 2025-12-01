import { useState } from 'react';

function ProductItem({ imageAspect = 'aspect-square', product }) {
  const [quantity, setQuantity] = useState(1);

  // Asumimos que la propiedad se llama 'stock' (ajusta si es necesario)
  var maxStock = product.stockQuantity;

  // --- LÓGICA DE CANTIDAD (Igual que antes) ---
  const handleIncrement = () => {
    setQuantity(prev => (prev < maxStock ? prev + 1 : prev));
  };

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  // --- LÓGICA DEL CARRITO (NUEVO) ---
  const addToCart = () => {
    // 1. Obtener el carrito actual del localStorage (o un array vacío si no existe)
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

    // 2. Buscar si el producto ya existe en el carrito (por ID)
    const existingProductIndex = storedCart.findIndex(item => item.id === product.id);

    if (existingProductIndex >= 0) {
      // CASO A: El producto YA ESTABA -> Sumamos la cantidad
      // Opcional: Aquí podrías validar que la suma no supere el stock total
      storedCart[existingProductIndex].quantity += quantity;
    } else {
      // CASO B: El producto ES NUEVO -> Lo agregamos al array
      // Guardamos toda la info del producto + la cantidad seleccionada
      storedCart.push({ ...product, quantity: quantity });
    }

    // 3. Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(storedCart));

    // Feedback para el usuario (puedes cambiarlo por un toast/notificación más bonito luego)
    console.log(`Se agregaron ${quantity} unidad(es) de ${product.name} al carrito.`);

    // Opcional: Resetear el contador a 1 después de agregar
    setQuantity(1);

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

          {/* Controles + / - */}
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

          {/* BOTÓN AGREGAR: Conectado a la función addToCart */}
          <button
            onClick={addToCart}
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors active:scale-95"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Mensaje de stock límite */}
      {quantity >= maxStock && (
        <div className="text-[10px] text-red-500 text-right mt-1 font-medium">
          Stock máx.
        </div>
      )}
    </>
  );
}

export default ProductItem;
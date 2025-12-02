import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { useState } from 'react';
import { frontendErrorMessage } from '../helpers/backendError';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      setErrorBackendMessage(''); // Limpiar errores previos
      await createProduct(formData);
      navigate('/admin/products');
    } catch (error) {
      if (error.response?.data?.code) {
        // Buscamos si existe un mensaje amigable para el código, sino usamos el detalle técnico
        const friendlyMessage = frontendErrorMessage[error.response.data.code]
                                || error.response.data.detail
                                || 'Ocurrió un error inesperado.';

        setErrorBackendMessage(friendlyMessage);
      } else {
        setErrorBackendMessage('Contactar a Soporte');
      }
    }
  };

  return (
    <Card>
      <form
        className='
          flex
          flex-col
          gap-20
          p-8

          sm:gap-4
        '
        onSubmit={handleSubmit(onValid)}
      >
        {/* SKU: Obligatorio */}
        <Input
          label='SKU'
          error={errors.sku?.message}
          {...register('sku', {
            required: 'SKU es requerido',
          })}
        />

        {/* Código Único: Opcional (sin validación required) */}
        <Input
          label='Código Único'
          error={errors.cui?.message}
          {...register('cui')}
        />

        {/* Nombre: Obligatorio */}
        <Input
          label='Nombre'
          error={errors.name?.message}
          {...register('name', {
            required: 'Nombre es requerido',
          })}
        />

        {/* Descripción: Opcional (sin cambios) */}
        <Input
          label='Descripción'
          {...register('description')}
        />

        {/* Precio: Mayor a 0 */}
        <Input
          label='Precio'
          error={errors.price?.message}
          type='number'
          step="0.01"
          {...register('price', {
            required: 'El precio es requerido',
            validate: (value) => parseFloat(value) > 0 || 'El precio debe ser mayor a 0',
          })}
        />

        {/* Stock: Mayor a 0 */}
        <Input
          label='Stock'
          error={errors.stock?.message}
          type='number'
          {...register('stock', {
            required: 'El stock es requerido',
            validate: (value) => parseInt(value) > 0 || 'El stock debe ser mayor a 0',
          })}
        />

        <div className='sm:text-end'>
          <Button type='submit' className='w-full sm:w-fit'>Crear Producto</Button>
        </div>

        {/* Renderizado de errores del Backend */}
        {errorBackendMessage && (
          <div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
            <p>{errorBackendMessage}</p>
          </div>
        )}
      </form>
    </Card>
  );
};

export default CreateProductForm;
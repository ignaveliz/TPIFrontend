import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

// Aceptamos la prop opcional onSuccess
function LoginForm({ onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();
  const { singin } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error, role } = await singin(formData.username, formData.password);

      if (error) {
        setErrorMessage(error.frontendErrorMessage);

        return;
      }

      // LÓGICA MODIFICADA:
      // Si existe onSuccess (es decir, estamos en el modal), lo ejecutamos y no navegamos.
      if (onSuccess) {
        onSuccess();

        return;
      }

      // Comportamiento normal (Página de Login)
      if (role === 'Admin' || role === 'Tester') {
        navigate('/admin/home');
      } else {
        navigate('/');
      }

    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Llame a soporte');
      }
    }
  };

  return (
    <form className='
        flex
        flex-col
        gap-8
        bg-white
        p-8
        w-full
        rounded-lg
      '
    onSubmit={handleSubmit(onValid)}
    >
      {/* Título opcional para que parezca el diseño de la imagen */}
      <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>

      <Input
        label='Usuario'
        { ...register('username', { required: 'Usuario es obligatorio' }) }
        error={errors.username?.message}
      />
      <Input
        label='Contraseña'
        { ...register('password', { required: 'Contraseña es obligatorio' }) }
        type='password'
        error={errors.password?.message}
      />

      <div className="flex flex-col gap-3 pt-4">
        <Button type='submit'>Iniciar Sesión</Button>
        {/* Solo mostramos el botón de registro si NO estamos en el modal, o lo dejamos opcional */}
        {!onSuccess && (
          <Button variant='secondary' onClick={() => navigate('/signup')}>Registrar Usuario</Button>
        )}
      </div>

      {errorMessage && <p className='text-red-500 text-center'>{errorMessage}</p>}
    </form>
  );
};

export default LoginForm;
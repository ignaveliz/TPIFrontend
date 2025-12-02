import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

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

      if (onSuccess) {
        onSuccess();

        return;
      }

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

  // --- LÓGICA DE ESTILOS ---
  // 1. Estilo ORIGINAL para la página /login (Tal cual tu archivo original)
  const originalPageStyles = `
    flex
    flex-col
    gap-20
    bg-white
    p-8
    sm:w-md
    sm:gap-4
    sm:rounded-lg
    sm:shadow-lg
  `;

  // 2. Estilo LIMPIO para la Modal (Sin sombra, sin fondo, ancho 100%)
  const modalStyles = `
    flex
    flex-col
    gap-4
    w-full
  `;

  return (
    <form
      className={onSuccess ? modalStyles : originalPageStyles}
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        label='Usuario'
        {...register('username', {
          required: 'Usuario es obligatorio',
        })}
        error={errors.username?.message}
      />

      <Input
        label='Contraseña'
        {...register('password', {
          required: 'Contraseña es obligatorio',
        })}
        type='password'
        error={errors.password?.message}
      />

      {/* Botones */}
      <div className='flex flex-col gap-3 mt-2'>
        <Button type='submit'>Iniciar Sesión</Button>

        {/* El botón de registro SOLO se muestra en la página normal, no en la modal */}
        {!onSuccess && (
          <Button variant='secondary' onClick={() => navigate('/signup')}>
            Registrar Usuario
          </Button>
        )}
      </div>

      {errorMessage && <p className='text-red-500 text-center'>{errorMessage}</p>}
    </form>
  );
};

export default LoginForm;
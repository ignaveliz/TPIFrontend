import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { frontendErrorMessage } from '../helpers/backendError';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import Select from '../../shared/components/Select';

const roleOptions = [
  { label: 'Usuario', value: 'Usuario' },
  { label: 'Administrador', value: 'Admin' },
  { label: 'Tester', value: 'Tester' },
];

function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', email: '', role: '', password: '', confirmPassword: '' } });

  const navigate = useNavigate();
  const { signup } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error, role } = await signup(
        formData.username,
        formData.email,
        formData.role,
        formData.password,
      );

      if (error) {
        setErrorMessage(error.frontendErrorMessage);

        return;
      }

      if (role === 'Admin' || role === 'Tester') {
        navigate('/admin/home');

        return;
      }
      else navigate('/');
    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Llame a soporte');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className='flex
        flex-col
        gap-20
        bg-white
        p-8
        sm:w-md
        sm:gap-4
        sm:rounded-lg
        sm:shadow-lg'>

      <Input
        label='Usuario'
        {...register('username', { required: 'Usuario es obligatorio' })}
        error={errors.username?.message}
      />

      <Input
        label='Email'
        type='email'
        {...register('email', {
          required: 'Email es obligatorio',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email inválido' },
        })}
        error={errors.email?.message}
      />

      <Select
        label='Rol'
        options={roleOptions}
        {...register('role', { required: 'Rol es obligatorio' })}
        error={errors.role?.message}
      />

      <Input
        label='Contraseña'
        type='password'
        {...register('password', {
          required: 'Contraseña es obligatoria',
          minLength: { value: 6, message: 'Mínimo 6 caracteres' },
        })}
        error={errors.password?.message}
      />

      <Input
        label='Confirmar contraseña'
        type='password'
        {...register('confirmPassword', {
          required: 'Confirmar contraseña es obligatoria',
          validate: (value) =>
            value === (document.querySelector('input[name="password"]')?.value) || 'Las contraseñas no coinciden',
        })}
        error={errors.confirmPassword?.message}
      />

      <Button type='submit'>Registrar Usuario</Button>
      <Button type='button' variant='secondary' onClick={() => navigate('/login')}>
          Inicio de Sesión
      </Button>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

    </form>
  );
}

export default RegisterForm;
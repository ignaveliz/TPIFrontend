import { useState, useEffect } from 'react';
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

function RegisterForm({ onSuccess, defaultRole }) {
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      role: defaultRole || '',
      password: '',
      confirmPassword: '',
    },
  });

  const navigate = useNavigate();
  const { signup } = useAuth();

  useEffect(() => {
    if (defaultRole) {
      setValue('role', defaultRole);
    }
  }, [defaultRole, setValue]);

  const onValid = async (formData) => {
    try {
      const roleToSend = defaultRole || formData.role;

      const { error, role } = await signup(
        formData.username,
        formData.email,
        roleToSend,
        formData.password,
      );

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
  // CAMBIO CLAVE: gap-20 -> gap-4
  // Usamos gap-4 en móvil para que los múltiples campos no estiren la pantalla infinitamente.
  const originalPageStyles = `
    flex
    flex-col
    gap-4
    bg-white
    p-8
    sm:w-md
    sm:gap-4
    sm:rounded-lg
    sm:shadow-lg
  `;

  const modalStyles = `
    flex
    flex-col
    gap-4
    w-full
  `;

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className={onSuccess ? modalStyles : originalPageStyles}
    >
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

      {!defaultRole && (
        <Select
          label='Rol'
          options={roleOptions}
          {...register('role', { required: 'Rol es obligatorio' })}
          error={errors.role?.message}
        />
      )}

      <Input
        label='Contraseña'
        type='password'
        {...register('password', {
          required: 'Contraseña es obligatoria',
          minLength: { value: 8, message: 'Mínimo 8 caracteres' },
          pattern: {
            value: /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
            message: 'Debe tener al menos una mayúscula y un símbolo especial',
          },
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

      <div className="flex flex-col gap-3 pt-2">
        <Button type='submit'>Registrar Usuario</Button>

        {!onSuccess && (
          <Button type='button' variant='secondary' onClick={() => navigate('/login')}>
              Inicio de Sesión
          </Button>
        )}
      </div>

      {errorMessage && <p className='text-red-500 text-center'>{errorMessage}</p>}
    </form>
  );
}

export default RegisterForm;
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

  // Si hay un defaultRole, lo inicializamos en el formulario
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      role: defaultRole || '', // Inicializar con el rol por defecto si existe
      password: '',
      confirmPassword: '',
    },
  });

  const navigate = useNavigate();
  const { signup } = useAuth();

  // Forzar el valor del rol si se pasa por props (efecto de seguridad)
  useEffect(() => {
    if (defaultRole) {
      setValue('role', defaultRole);
    }
  }, [defaultRole, setValue]);

  const onValid = async (formData) => {
    try {
      // Si hay defaultRole, nos aseguramos que se envíe ese, aunque el input esté oculto
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

      // Si se provee onSuccess (comportamiento Modal), lo ejecutamos y no navegamos
      if (onSuccess) {
        onSuccess();

        return;
      }

      // Comportamiento normal (Página /signup)
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
  // Estilo ORIGINAL para la página /signup
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

  // Estilo LIMPIO para la Modal
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

      {/* Solo mostramos el Select si NO hay un rol por defecto forzado */}
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

      <Button type='submit'>Registrar Usuario</Button>

      {/* El botón de ir a Login solo se muestra en la página completa, no en la modal */}
      {!onSuccess && (
        <Button type='button' variant='secondary' onClick={() => navigate('/login')}>
            Inicio de Sesión
        </Button>
      )}

      {errorMessage && <p className='text-red-500 text-center'>{errorMessage}</p>}
    </form>
  );
}

export default RegisterForm;
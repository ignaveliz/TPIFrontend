import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className='
      flex
      flex-col
      justify-center
      min-h-[100dvh]
      py-10
      bg-neutral-100
      sm:items-center
      sm:py-0
    '>
      <RegisterForm />
    </div>);
}

export default RegisterPage;
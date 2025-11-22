import Button from '../../shared/components/Button';
import { useNavigate } from 'react-router-dom';

function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className='
      flex
      flex-col
      justify-center
      h-[100dvh]
      bg-neutral-100
      sm:items-center
    '>
      <div className='
        flex
        flex-col
        gap-20
        bg-white
        p-8
        sm:w-md
        sm:gap-4
        sm:rounded-lg
        sm:shadow-lg
      '>
        <h1 className='
        text-3xl
        font-bold
        text-center
        '>
        403 - No autorizado
        </h1>
        <p className='
        text-center
        text-lg
        '>
        No tenés permiso para acceder a esta página.
        </p>
        <Button onClick={() => navigate('/')}>Back Home</Button>
      </div>

    </div>

  );
}

export default UnauthorizedPage;
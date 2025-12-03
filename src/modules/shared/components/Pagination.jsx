import Button from './Button';

function Pagination({ pageNumber, totalPages, onPageChange, pageSize, onPageSizeChange }) {
  return (
    <div className='flex justify-center items-center mt-3 gap-3'>
      <Button
        variant="secondary"
        disabled={pageNumber === 1}
        onClick={() => onPageChange(pageNumber - 1)}
      >
        Atrás
      </Button>

      <span className="mx-2">{pageNumber} / {totalPages}</span>

      <Button
        variant="secondary"
        disabled={pageNumber >= totalPages}
        onClick={() => onPageChange(pageNumber + 1)}
      >
        Siguiente
      </Button>

      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className='p-1 border rounded cursor-pointer'
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
    </div>
  );
}
export default Pagination;
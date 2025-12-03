import Button from './Button';

function SearchBar({ value, onChange, onSearch, placeholder = 'Buscar...', className }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder={placeholder}
        className='w-full border border-gray-200 rounded-md p-2 hover:shadow transition-shadow'
      />
      {onSearch && (
        <Button className='h-10 w-10 flex items-center justify-center' onClick={onSearch}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </Button>
      )}
    </div>
  );
}
export default SearchBar;
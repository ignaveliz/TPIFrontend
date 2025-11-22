function Select({ label, options, error, ...restProps }) {
  return (
    <div className='
        flex
        flex-col
        h-20'>
      <label>{label}:</label>
      <select className={ error && 'border-red-400' } { ...restProps }>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-base sm:text-xs">{error}</p>}
    </div>
  );
}

export default Select;
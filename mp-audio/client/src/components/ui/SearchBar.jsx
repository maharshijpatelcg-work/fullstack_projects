import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = 'Search songs, artists...', autoFocus = false }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    setValue('');
    if (onSearch) {
      onSearch('');
    }
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-bg-elevated border border-white/10 focus:border-brand rounded-2xl pl-12 pr-10 py-4 text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 font-body text-base"
        autoFocus={autoFocus}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

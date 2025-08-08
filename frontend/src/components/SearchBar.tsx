import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar: React.FC<{ onSearch: (q: string) => void; placeholder?: string }> = ({ onSearch, placeholder }) => {
  const [q, setQ] = useState('');
  return (
    <TextField
      fullWidth
      size="small"
      value={q}
      onChange={(e) => setQ(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') onSearch(q); }}
      placeholder={placeholder || 'Search products...'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => onSearch(q)}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

export default SearchBar;



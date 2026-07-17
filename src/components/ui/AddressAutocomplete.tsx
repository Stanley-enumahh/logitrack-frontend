import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiMapPin, FiLoader } from "react-icons/fi";
import { searchAddress, type GeocodeResult } from "../../api/geocoding";
import { useDebounce } from "../../hooks/useDebounce";

interface AddressAutocompleteProps {
  placeholder?: string;
  defaultValue?: string;
  onSelect: (result: GeocodeResult) => void;
  error?: string;
}

export default function AddressAutocomplete({
  placeholder = "Search for an address",
  defaultValue = "",
  onSelect,
  error,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSelected, setHasSelected] = useState(!!defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 400);

  const { data: results, isFetching } = useQuery({
    queryKey: ["geocode", debouncedQuery],
    queryFn: () => searchAddress(debouncedQuery),
    enabled: debouncedQuery.length >= 3 && !hasSelected,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setHasSelected(false);
    setIsOpen(true);
  };

  const handleSelect = (result: GeocodeResult) => {
    setQuery(result.address);
    setHasSelected(true);
    setIsOpen(false);
    onSelect(result);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        {isFetching && (
          <FiLoader className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 animate-spin" />
        )}
      </div>

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}

      {isOpen && results && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-56 overflow-y-auto">
          {results.map((result, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(result)}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-start gap-2 border-b border-slate-100 last:border-0"
            >
              <FiMapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span>{result.address}</span>
            </button>
          ))}
        </div>
      )}

      {isOpen &&
        debouncedQuery.length >= 3 &&
        !isFetching &&
        results?.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg px-3 py-2">
            <p className="text-slate-400 text-xs">No addresses found</p>
          </div>
        )}
    </div>
  );
}

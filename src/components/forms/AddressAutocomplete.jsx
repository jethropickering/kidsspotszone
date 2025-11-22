import { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiCheck } from 'react-icons/fi';
import { geocodingService } from '../../services/geocodingService';

/**
 * AddressAutocomplete Component
 *
 * Provides address autocomplete functionality for forms
 * Uses OpenStreetMap Nominatim API (free)
 *
 * Props:
 * - value: Current input value
 * - onChange: Called when value changes
 * - onSelect: Called when address is selected from dropdown
 * - placeholder: Input placeholder text
 * - required: Is field required
 * - error: Error message to display
 */
export default function AddressAutocomplete({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Start typing an address...',
  required = false,
  error = null,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce timeout
  const debounceTimeout = useRef(null);

  // Fetch suggestions when input changes
  useEffect(() => {
    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Don't search for very short inputs
    if (value.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Set loading state
    setIsLoading(true);

    // Debounce the search
    debounceTimeout.current = setTimeout(async () => {
      try {
        const results = await geocodingService.getAddressSuggestions(value);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error('Address autocomplete error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion.label);
    setShowDropdown(false);
    setSuggestions([]);

    // Call onSelect callback with full suggestion data
    if (onSelect) {
      onSelect({
        address: suggestion.label,
        latitude: suggestion.latitude,
        longitude: suggestion.longitude,
        components: suggestion.address,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;

      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;

      default:
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-12 pr-4 py-3 border-2 ${
            error ? 'border-red-300' : 'border-gray-200'
          } rounded-xl focus:border-primary-500 focus:outline-none transition-colors`}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-gray-400"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.label}
                  </p>
                  {suggestion.address && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {suggestion.address.suburb || suggestion.address.city},{' '}
                      {suggestion.address.state}
                    </p>
                  )}
                </div>
                {index === selectedIndex && (
                  <FiCheck className="w-5 h-5 text-primary-500 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="text-xs text-gray-500 mt-1">
          Start typing to search for addresses in Australia
        </p>
      )}
    </div>
  );
}

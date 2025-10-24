import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
  searchProducts,
  clearSearchResults,
} from "../../store/slices/productSlice";

const SearchBar = ({
  isOpen,
  onClose,
  className = "",
  placeholder = "Search products...",
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const { searchResults, isLoading } = useSelector((state) => state.products);
  const { recentSearches } = useSelector((state) => state.ui);

  // Popular/trending searches
  const trendingSearches = [
    "Corporate gifts",
    "Customized mugs",
    "Tech accessories",
    "Promotional items",
    "Gift boxes",
    "Branded merchandise",
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length >= 2) {
      setShowSuggestions(true);
      dispatch(
        searchProducts({
          query: value,
          limit: 8,
          preview: true,
        })
      );
    } else {
      setShowSuggestions(false);
      dispatch(clearSearchResults());
    }
  };

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      // dispatch(addRecentSearch(searchQuery));

      // Navigate to search results
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);

      // Clear and close
      setQuery("");
      setShowSuggestions(false);
      onClose?.();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      onClose?.();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "product") {
      navigate(`/products/${suggestion.id}`);
    } else {
      handleSearch(suggestion.query || suggestion);
    }
  };

  const clearQuery = () => {
    setQuery("");
    setShowSuggestions(false);
    dispatch(clearSearchResults());
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(query.length >= 2 || true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-16 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-sm text-gray-900 placeholder-gray-400 transition-colors hover:border-gray-400"
        />

        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
          {query && (
            <button
              onClick={clearQuery}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}

          {/* Advanced Search Toggle */}
          <button className="p-1 text-gray-400 hover:text-yellow-600 transition-colors rounded">
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400 mx-auto"></div>
              <span className="mt-2 block text-sm">Searching...</span>
            </div>
          )}

          {!isLoading && (
            <>
              {/* Product Results */}
              {searchResults?.products?.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 uppercase tracking-wide">
                    Products
                  </div>
                  {searchResults.products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() =>
                        handleSuggestionClick({
                          type: "product",
                          id: product.id,
                        })
                      }
                      className="w-full px-3 py-2.5 hover:bg-gray-50 flex items-center space-x-3 text-left transition-colors group"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-yellow-600">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₹{product.price}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Query Suggestions */}
              {query.trim() && (
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => handleSearch()}
                    className="w-full px-3 py-2.5 hover:bg-gray-50 flex items-center space-x-2 text-left transition-colors group"
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 group-hover:text-yellow-500" />
                    <span className="text-sm text-gray-900 group-hover:text-yellow-600">
                      Search for "<span className="font-medium">{query}</span>"
                    </span>
                  </button>
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches?.length > 0 && !query.trim() && (
                <div className="border-b border-gray-100">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 uppercase tracking-wide">
                    Recent Searches
                  </div>
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full px-3 py-2.5 hover:bg-gray-50 flex items-center space-x-2 text-left transition-colors group"
                    >
                      <ClockIcon className="h-4 w-4 text-gray-400 group-hover:text-yellow-500" />
                      <span className="text-sm text-gray-900 group-hover:text-yellow-600">
                        {search}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Trending Searches */}
              {!query.trim() && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 uppercase tracking-wide">
                    Trending Searches
                  </div>
                  {trendingSearches.map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(trend)}
                      className="w-full px-3 py-2.5 hover:bg-gray-50 flex items-center space-x-2 text-left transition-colors group"
                    >
                      <ArrowTrendingUpIcon className="h-4 w-4 text-gray-400 group-hover:text-yellow-500" />
                      <span className="text-sm text-gray-900 group-hover:text-yellow-600">
                        {trend}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {query.trim() &&
                searchResults?.products?.length === 0 &&
                !isLoading && (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No products found for "{query}"</p>
                    <p className="text-xs mt-1 text-gray-400">
                      Try searching with different keywords
                    </p>
                  </div>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

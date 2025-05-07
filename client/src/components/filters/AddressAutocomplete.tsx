import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface AddressAutocompleteProps {
  onAddressSelect: (address: string, zipCode: string) => void;
  value?: string;
  disabled?: boolean;
}

interface NominatimResult {
  display_name: string;
  place_id: number;
  lat: string;
  lon: string;
  address: {
    postcode: string;
    city: string;
    state: string;
    country: string;
  };
}

export function AddressAutocomplete({
  onAddressSelect,
  value = "",
  disabled = false,
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedValue = useDebounce(inputValue, 300);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedValue || debouncedValue.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedValue
          )}&countrycodes=us&limit=5&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "en-US,en;q=0.9",
            },
          }
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  const handleSuggestionClick = (suggestion: NominatimResult) => {
    const zipCode = suggestion.address?.postcode || "";
    setInputValue(suggestion.display_name);
    onAddressSelect(suggestion.display_name, zipCode);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={suggestionsRef}>
      <Input
        type="text"
        placeholder="Enter your address..."
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        className="pr-10"
        disabled={disabled}
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

      {showSuggestions && (inputValue.length >= 3 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-2 text-sm text-gray-500">
              Loading suggestions...
            </div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-sm text-gray-500">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

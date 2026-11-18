import { useEffect, useState } from "react";
import api from "../api/axios";

const CustomerSearch = ({ value, onSelect }) => {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    const load = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        const { data } = await api.get(
          `/api/customers?q=${encodeURIComponent(query)}`,
        );
        setResults(data || []);
      } catch (error) {
        setResults([]);
      }
    };

    const id = setTimeout(load, 250);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <div className="relative">
      <input
        className="h-11 w-full rounded-lg border border-gray-300 px-3"
        placeholder="Search customer"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.length > 0 ? (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg max-h-56 overflow-auto">
          {results.map((customer) => (
            <button
              key={customer._id}
              type="button"
              onClick={() => {
                setQuery(customer.name);
                onSelect(customer);
                setResults([]);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50"
            >
              <p className="font-medium text-sm">{customer.name}</p>
              <p className="text-xs text-gray-500">{customer.mobile}</p>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CustomerSearch;

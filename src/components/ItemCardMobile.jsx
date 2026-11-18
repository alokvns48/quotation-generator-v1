const ItemCardMobile = ({ item, index, onChange, onRemove }) => {
  return (
    <div className="relative border border-gray-200 rounded-xl p-3 space-y-3 bg-white">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute right-2 top-2 h-8 w-8 rounded-full bg-red-50 text-red-600"
        aria-label="Delete item"
      >
        ×
      </button>

      <input
        className="w-full h-11 rounded-lg border border-gray-300 px-3"
        placeholder="Particulars"
        value={item.particulars}
        onChange={(e) => onChange(index, "particulars", e.target.value)}
      />

      <div className="grid grid-cols-4 gap-2">
        <input
          className="h-11 rounded-lg border border-gray-300 px-2"
          placeholder="Unit"
          value={item.unit}
          onChange={(e) => onChange(index, "unit", e.target.value)}
        />
        <input
          className="h-11 rounded-lg border border-gray-300 px-2"
          placeholder="Qty"
          type="number"
          min="0"
          value={item.quantity}
          onChange={(e) => onChange(index, "quantity", e.target.value)}
        />
        <input
          className="h-11 rounded-lg border border-gray-300 px-2"
          placeholder="Rate"
          type="number"
          min="0"
          value={item.rate}
          onChange={(e) => onChange(index, "rate", e.target.value)}
        />
        <div className="h-11 rounded-lg border border-gray-200 px-2 flex items-center text-sm font-semibold bg-gray-50">
          ₹{Number(item.amount || 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ItemCardMobile;

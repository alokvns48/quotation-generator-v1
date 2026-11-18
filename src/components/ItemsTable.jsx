import ItemCardMobile from "./ItemCardMobile";

const ItemsTable = ({ items, onChange, onAdd, onRemove }) => {
  return (
    <div className="space-y-3">
      <div className="space-y-3 lg:hidden">
        {items.map((item, index) => (
          <ItemCardMobile
            key={index}
            item={item}
            index={index}
            onChange={onChange}
            onRemove={onRemove}
          />
        ))}
      </div>

      <div className="hidden lg:block overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2 border-r border-gray-200">Sl.No</th>
              <th className="text-left px-3 py-2 border-r border-gray-200">Particulars</th>
              <th className="text-left px-3 py-2 border-r border-gray-200">Unit</th>
              <th className="text-left px-3 py-2 border-r border-gray-200">Qty</th>
              <th className="text-left px-3 py-2 border-r border-gray-200">Rate</th>
              <th className="text-left px-3 py-2 border-r border-gray-200">Amount</th>
              <th className="text-left px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t border-gray-100">
                <td className="px-3 py-2">{index + 1}</td>
                <td className="px-3 py-2">
                  <input
                    className="h-11 w-full rounded-lg border border-gray-300 px-3"
                    value={item.particulars}
                    onChange={(e) =>
                      onChange(index, "particulars", e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="h-11 w-full rounded-lg border border-gray-300 px-3"
                    value={item.unit}
                    onChange={(e) => onChange(index, "unit", e.target.value)}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="h-11 w-full rounded-lg border border-gray-300 px-3"
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) =>
                      onChange(index, "quantity", e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className="h-11 w-full rounded-lg border border-gray-300 px-3"
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(e) => onChange(index, "rate", e.target.value)}
                  />
                </td>
                <td className="px-3 py-2 font-semibold">
                  ₹{Number(item.amount || 0).toFixed(2)}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="h-11 px-3 rounded-lg bg-red-50 text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="h-11 w-full sm:w-auto sm:px-4 rounded-lg bg-slate-800 text-white"
      >
        + Add Item
      </button>
    </div>
  );
};

export default ItemsTable;

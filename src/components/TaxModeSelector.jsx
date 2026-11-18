const modes = [
  { value: "exclusive", label: "Exclusive" },
  { value: "inclusive", label: "Inclusive" },
  { value: "none", label: "None" },
];

const TaxModeSelector = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1">
      {modes.map((mode) => (
        <button
          key={mode.value}
          type="button"
          onClick={() => onChange(mode.value)}
          className={`h-11 rounded-lg text-sm font-medium ${
            value === mode.value ? "bg-blue-600 text-white" : "text-gray-700"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default TaxModeSelector;

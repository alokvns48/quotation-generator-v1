const QuotationSummary = ({
  subtotal,
  gstAmount,
  grandTotal,
  taxType,
  gstPercent,
}) => {
  const gstRate = Number(gstPercent || 0);
  const halfRate = gstRate / 2;
  const totalTax = Number(gstAmount || 0);
  const halfTax = totalTax / 2;
  const totalAmount = Number(grandTotal || 0);

  const Row = ({ label, value, total = false }) => (
    <div
      className={
        total
          ? "flex items-center justify-between rounded-xl bg-[#3f679f] px-3 py-2 text-white"
          : "flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700"
      }
    >
      <span className={total ? "text-sm font-semibold" : "text-sm"}>
        {label}
      </span>
      <span
        className={
          total ? "text-base font-bold" : "text-sm font-medium text-gray-900"
        }
      >
        {value}
      </span>
    </div>
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
          Tax Breakdown
        </p>
      </div>
      <div className="space-y-2 p-4">
        {taxType === "exclusive" ? (
          <>
            <Row
              label="Subtotal"
              value={`₹${Number(subtotal || 0).toFixed(2)}`}
            />
            <Row label={`SGST ${halfRate}%`} value={`₹${halfTax.toFixed(2)}`} />
            <Row label={`CGST ${halfRate}%`} value={`₹${halfTax.toFixed(2)}`} />
            <Row
              label={`Total Tax (${gstRate}%)`}
              value={`₹${totalTax.toFixed(2)}`}
            />
            <Row
              label="Grand Total"
              value={`₹${totalAmount.toFixed(2)}`}
              total
            />
          </>
        ) : null}

        {taxType === "inclusive" ? (
          <>
            <Row
              label="Subtotal"
              value={`₹${Number(subtotal || 0).toFixed(2)}`}
            />
            <Row
              label={`Included Tax (${gstRate}%)`}
              value={`₹${totalTax.toFixed(2)}`}
            />
            <Row label={`SGST ${halfRate}%`} value={`₹${halfTax.toFixed(2)}`} />
            <Row label={`CGST ${halfRate}%`} value={`₹${halfTax.toFixed(2)}`} />
            <Row
              label="Grand Total"
              value={`₹${totalAmount.toFixed(2)}`}
              total
            />
          </>
        ) : null}

        {taxType === "none" ? (
          <Row label="Total" value={`₹${totalAmount.toFixed(2)}`} total />
        ) : null}
      </div>
    </div>
  );
};

export default QuotationSummary;

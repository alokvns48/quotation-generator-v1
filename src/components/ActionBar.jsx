const ActionBar = ({ onDownloadPDF, onPrint, onEdit }) => {
  return (
    <>
      <div className="hidden lg:flex gap-3 justify-end mb-6 no-print">
        <button
          onClick={onEdit}
          className="h-11 px-4 rounded-lg bg-gray-100 text-gray-800"
        >
          ✏ Edit
        </button>
        <button
          onClick={onPrint}
          className="h-11 px-4 rounded-lg bg-gray-100 text-gray-800"
        >
          🖨 Print
        </button>
        <button
          onClick={onDownloadPDF}
          className="h-11 px-4 rounded-lg bg-blue-600 text-white"
        >
          ⬇ Download PDF
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex gap-2 no-print lg:hidden z-50">
        <button
          onClick={onDownloadPDF}
          className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium"
        >
          ⬇ Download PDF
        </button>
        <button
          onClick={onPrint}
          className="flex-1 bg-gray-100 text-gray-800 rounded-lg py-2 text-sm font-medium"
        >
          🖨 Print
        </button>
        <button
          onClick={onEdit}
          className="flex-1 bg-gray-100 text-gray-800 rounded-lg py-2 text-sm font-medium"
        >
          ✏ Edit
        </button>
      </div>
    </>
  );
};

export default ActionBar;

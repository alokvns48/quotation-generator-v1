import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const QuotationCard = ({ quotation, onDelete }) => {
  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-gray-900">
          {quotation.quotationNumber}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(quotation.date).toLocaleDateString()}
        </p>
      </div>

      <p className="text-sm text-gray-700">{quotation.customer?.name}</p>
      <p className="font-bold text-lg">
        ₹{Number(quotation.grandTotal || 0).toLocaleString()}
      </p>
      <StatusBadge status={quotation.status} />

      <div className="flex items-center gap-3 pt-2 border-t border-gray-100 text-lg">
        <Link to={`/quotations/${quotation._id}/preview`} title="View">
          👁
        </Link>
        <Link to={`/quotations/${quotation._id}`} title="Edit">
          ✏
        </Link>
        <button
          type="button"
          onClick={() => onDelete(quotation._id)}
          title="Delete"
        >
          🗑
        </button>
      </div>
    </div>
  );
};

export default QuotationCard;

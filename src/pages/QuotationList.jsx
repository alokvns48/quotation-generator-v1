import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import QuotationCard from "../components/QuotationCard";
import StatusBadge from "../components/StatusBadge";

const statusOptions = ["", "draft", "sent", "accepted", "rejected"];

const QuotationList = () => {
  const [filters, setFilters] = useState({
    status: "",
    from: "",
    to: "",
    q: "",
  });
  const [items, setItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);
    if (filters.q) params.append("q", filters.q);

    const { data } = await api.get(`/api/quotations?${params.toString()}`);
    setItems(data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteQuotation = async (id) => {
    await api.delete(`/api/quotations/${id}`);
    fetchData();
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/api/quotations/${id}/status`, { status });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
        <Link
          to="/quotations/new"
          className="h-11 w-full sm:w-auto px-4 rounded-lg bg-blue-600 text-white font-medium inline-flex items-center justify-center"
        >
          New Quote
        </Link>
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6">
        <button
          type="button"
          className="lg:hidden h-11 w-full rounded-lg border border-gray-300 text-sm font-medium"
          onClick={() => setShowFilters((s) => !s)}
        >
          Filters
        </button>

        <div
          className={`${showFilters ? "block" : "hidden"} lg:block mt-3 lg:mt-0`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <select
              className="h-11 rounded-lg border border-gray-300 px-3"
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              {statusOptions.map((s) => (
                <option key={s || "all"} value={s}>
                  {s ? s : "All Statuses"}
                </option>
              ))}
            </select>
            <input
              className="h-11 rounded-lg border border-gray-300 px-3"
              type="date"
              value={filters.from}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, from: e.target.value }))
              }
            />
            <input
              className="h-11 rounded-lg border border-gray-300 px-3"
              type="date"
              value={filters.to}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, to: e.target.value }))
              }
            />
            <input
              className="h-11 rounded-lg border border-gray-300 px-3"
              placeholder="Search quote/customer"
              value={filters.q}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, q: e.target.value }))
              }
            />
          </div>
          <div className="mt-3">
            <button
              className="h-11 w-full sm:w-auto sm:px-5 rounded-lg bg-slate-900 text-white"
              onClick={fetchData}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </section>

      <div className="space-y-3 lg:hidden">
        {items.map((quotation) => (
          <QuotationCard
            key={quotation._id}
            quotation={quotation}
            onDelete={deleteQuotation}
          />
        ))}
      </div>

      <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl p-4 lg:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-2">Quote No</th>
              <th className="py-2">Date</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((quotation) => (
              <tr key={quotation._id} className="border-b border-gray-100">
                <td className="py-3">{quotation.quotationNumber}</td>
                <td className="py-3">
                  {new Date(quotation.date).toLocaleDateString()}
                </td>
                <td className="py-3">{quotation.customer?.name}</td>
                <td className="py-3 font-semibold">
                  ₹{Number(quotation.grandTotal || 0).toLocaleString()}
                </td>
                <td className="py-3">
                  <StatusBadge status={quotation.status} />
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/quotations/${quotation._id}/preview`}
                      className="text-blue-600"
                    >
                      View
                    </Link>
                    <Link
                      to={`/quotations/${quotation._id}`}
                      className="text-amber-600"
                    >
                      Edit
                    </Link>
                    <button
                      className="text-red-600"
                      onClick={() => deleteQuotation(quotation._id)}
                    >
                      Delete
                    </button>
                    <select
                      className="h-9 rounded border border-gray-300 px-2"
                      value={quotation.status}
                      onChange={(e) =>
                        updateStatus(quotation._id, e.target.value)
                      }
                    >
                      {statusOptions.filter(Boolean).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotationList;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/api/quotations");
        setQuotations(data || []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const thisMonth = quotations.filter((q) => {
      const d = new Date(q.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    return {
      total: quotations.length,
      thisMonth: thisMonth.length,
      accepted: quotations.filter((q) => q.status === "accepted").length,
      monthlyValue: thisMonth.reduce(
        (sum, q) => sum + Number(q.grandTotal || 0),
        0,
      ),
    };
  }, [quotations]);

  const recent = quotations.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/quotations/new"
          className="h-11 w-full sm:w-auto px-4 rounded-lg bg-blue-600 text-white font-medium inline-flex items-center justify-center"
        >
          New Quotation
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Quotations" value={stats.total} tone="slate" />
        <StatCard title="This Month" value={stats.thisMonth} tone="blue" />
        <StatCard title="Accepted" value={stats.accepted} tone="emerald" />
        <StatCard
          title="Monthly Value"
          value={`₹${stats.monthlyValue.toLocaleString()}`}
          tone="amber"
        />
      </div>

      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Quotations</h2>

        {loading ? <p className="text-gray-500">Loading...</p> : null}

        <div className="space-y-3 lg:hidden">
          {recent.map((q) => (
            <div
              key={q._id}
              className="border border-gray-200 rounded-xl p-4 space-y-2"
            >
              <div className="flex justify-between">
                <p className="font-semibold">{q.quotationNumber}</p>
                <StatusBadge status={q.status} />
              </div>
              <p className="text-sm text-gray-700">{q.customer?.name}</p>
              <p className="font-bold">
                ₹{Number(q.grandTotal || 0).toLocaleString()}
              </p>
              <Link
                className="text-sm text-blue-600 font-medium"
                to={`/quotations/${q._id}/preview`}
              >
                View
              </Link>
            </div>
          ))}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-2">Quote No</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((q) => (
                <tr key={q._id} className="border-b border-gray-100">
                  <td className="py-3">{q.quotationNumber}</td>
                  <td className="py-3">{q.customer?.name}</td>
                  <td className="py-3">
                    ₹{Number(q.grandTotal || 0).toLocaleString()}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="py-3">
                    <Link
                      className="text-blue-600"
                      to={`/quotations/${q._id}/preview`}
                    >
                      Preview
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

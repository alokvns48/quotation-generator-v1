import { useEffect, useState } from "react";
import api from "../api/axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", mobile: "", address: "" });

  const load = async (query = "") => {
    const { data } = await api.get(
      `/api/customers?q=${encodeURIComponent(query)}`,
    );
    setCustomers(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const createCustomer = async (e) => {
    e.preventDefault();
    await api.post("/api/customers", form);
    setForm({ name: "", mobile: "", address: "" });
    load(q);
  };

  const removeCustomer = async (id) => {
    await api.delete(`/api/customers/${id}`);
    load(q);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Customers</h1>

      <section className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6">
        <form
          onSubmit={createCustomer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <input
            className="h-11 rounded-lg border border-gray-300 px-3"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <input
            className="h-11 rounded-lg border border-gray-300 px-3"
            placeholder="Mobile"
            value={form.mobile}
            onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))}
          />
          <input
            className="h-11 rounded-lg border border-gray-300 px-3 lg:col-span-2"
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm((p) => ({ ...p, address: e.target.value }))
            }
          />
          <button className="h-11 w-full sm:w-auto sm:px-4 rounded-lg bg-blue-600 text-white">
            Add Customer
          </button>
        </form>
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6 space-y-4">
        <input
          className="h-11 w-full rounded-lg border border-gray-300 px-3"
          placeholder="Search customers"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="h-11 w-full sm:w-auto sm:px-4 rounded-lg bg-slate-900 text-white"
          onClick={() => load(q)}
        >
          Search
        </button>

        <div className="space-y-3 lg:hidden">
          {customers.map((customer) => (
            <div
              key={customer._id}
              className="border border-gray-200 rounded-xl p-4 bg-white"
            >
              <p className="font-semibold">{customer.name}</p>
              <p className="text-sm text-gray-600">{customer.mobile}</p>
              <p className="text-sm text-gray-600">{customer.address}</p>
              <button
                className="mt-2 text-red-600"
                onClick={() => removeCustomer(customer._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2">Name</th>
                <th className="py-2">Mobile</th>
                <th className="py-2">Address</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id} className="border-b border-gray-100">
                  <td className="py-3">{customer.name}</td>
                  <td className="py-3">{customer.mobile}</td>
                  <td className="py-3">{customer.address}</td>
                  <td className="py-3">
                    <button
                      className="text-red-600"
                      onClick={() => removeCustomer(customer._id)}
                    >
                      Delete
                    </button>
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

export default Customers;

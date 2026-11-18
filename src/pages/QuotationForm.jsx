import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import CustomerSearch from "../components/CustomerSearch";
import ItemsTable from "../components/ItemsTable";
import QuotationSummary from "../components/QuotationSummary";
import TaxModeSelector from "../components/TaxModeSelector";

const gstOptions = [0, 5, 12, 18, 28];

const createItem = (index = 0) => ({
  slNo: index + 1,
  particulars: "",
  unit: "pcs",
  quantity: 1,
  rate: 0,
  amount: 0,
});

const QuotationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    letterNo: "",
    customer: { name: "", mobile: "", address: "", customerId: "" },
    items: [createItem(0)],
    taxConfig: { type: "exclusive", gstPercent: 18 },
    notes: "",
    validUntil: "",
    saveAsCustomer: false,
  });
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!editing) return;

    const load = async () => {
      try {
        const { data } = await api.get(`/api/quotations/${id}`);
        setForm((prev) => ({
          ...prev,
          date: data.date
            ? new Date(data.date).toISOString().slice(0, 10)
            : prev.date,
          letterNo: data.letterNo || "",
          customer: {
            customerId: data.customer?.customerId || "",
            name: data.customer?.name || "",
            mobile: data.customer?.mobile || "",
            address: data.customer?.address || "",
          },
          items: (data.items || []).map((item, index) => ({
            ...item,
            slNo: index + 1,
          })),
          taxConfig: data.taxConfig || prev.taxConfig,
          notes: data.notes || "",
          validUntil: data.validUntil
            ? new Date(data.validUntil).toISOString().slice(0, 10)
            : "",
        }));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [editing, id]);

  const totals = useMemo(() => {
    const items = form.items.map((item, index) => {
      const quantity = Number(item.quantity || 0);
      const rate = Number(item.rate || 0);
      const amount = quantity * rate;
      return { ...item, slNo: index + 1, amount };
    });

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

    if (form.taxConfig.type === "exclusive") {
      const gstAmount =
        (subtotal * Number(form.taxConfig.gstPercent || 0)) / 100;
      return { items, subtotal, gstAmount, grandTotal: subtotal + gstAmount };
    }

    if (form.taxConfig.type === "inclusive") {
      return { items, subtotal, gstAmount: 0, grandTotal: subtotal };
    }

    return { items, subtotal, gstAmount: 0, grandTotal: subtotal };
  }, [form.items, form.taxConfig]);

  const setItemField = (index, key, value) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, createItem(prev.items.length)],
    }));
  };

  const removeItem = (index) => {
    setForm((prev) => {
      const items = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: items.length ? items : [createItem(0)] };
    });
  };

  const saveQuotation = async (status, goPreview) => {
    setSaving(true);
    setSaveError("");

    const payload = {
      date: form.date,
      letterNo: form.letterNo,
      status,
      customer: form.customer,
      items: totals.items,
      taxConfig: form.taxConfig,
      notes: form.notes,
      validUntil: form.validUntil || undefined,
    };

    try {
      const response = editing
        ? await api.put(`/api/quotations/${id}`, payload)
        : await api.post("/api/quotations", payload);

      if (form.saveAsCustomer && form.customer.name) {
        try {
          await api.post("/api/customers", {
            name: form.customer.name,
            mobile: form.customer.mobile,
            address: form.customer.address,
          });
        } catch (err) {
          console.warn(
            "Save-as-customer failed",
            err?.response?.data || err.message,
          );
        }
      }

      const quotationId = response?.data?._id || response?.data?.id;
      if (!quotationId) throw new Error("Server did not return quotation id");

      if (goPreview) {
        navigate(`/quotations/${quotationId}/preview`);
      } else {
        navigate("/quotations");
      }
    } catch (err) {
      console.error(err);
      setSaveError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save quotation",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading quotation...</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {editing ? "Edit" : "New"} Quotation
        </h1>

        <section className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6 space-y-4">
          <h2 className="text-lg font-semibold">Customer</h2>
          <CustomerSearch
            value={form.customer.name}
            onSelect={(customer) => {
              setForm((prev) => ({
                ...prev,
                customer: {
                  customerId: customer._id,
                  name: customer.name,
                  mobile: customer.mobile,
                  address: customer.address,
                },
              }));
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="h-11 rounded-lg border border-gray-300 px-3"
              placeholder="Customer Name"
              value={form.customer.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  customer: { ...prev.customer, name: e.target.value },
                }))
              }
            />
            <input
              className="h-11 rounded-lg border border-gray-300 px-3"
              placeholder="Mobile"
              value={form.customer.mobile}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  customer: { ...prev.customer, mobile: e.target.value },
                }))
              }
            />
            <input
              className="h-11 rounded-lg border border-gray-300 px-3 sm:col-span-2"
              placeholder="Address"
              value={form.customer.address}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  customer: { ...prev.customer, address: e.target.value },
                }))
              }
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.saveAsCustomer}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  saveAsCustomer: e.target.checked,
                }))
              }
            />
            Save as new customer
          </label>
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="date"
              className="h-11 rounded-lg border border-gray-300 px-3"
              value={form.date}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, date: e.target.value }))
              }
            />
            <input
              className="h-11 rounded-lg border border-gray-300 px-3"
              placeholder="Letter No"
              value={form.letterNo}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, letterNo: e.target.value }))
              }
            />
            <input
              type="date"
              className="h-11 rounded-lg border border-gray-300 px-3"
              value={form.validUntil}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, validUntil: e.target.value }))
              }
            />
          </div>

          <ItemsTable
            items={totals.items}
            onChange={setItemField}
            onAdd={addItem}
            onRemove={removeItem}
          />
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6 space-y-4">
          <h2 className="text-lg font-semibold">Tax</h2>
          <TaxModeSelector
            value={form.taxConfig.type}
            onChange={(type) =>
              setForm((prev) => ({
                ...prev,
                taxConfig: { ...prev.taxConfig, type },
              }))
            }
          />

          {form.taxConfig.type !== "none" ? (
            <select
              className="h-11 rounded-lg border border-gray-300 px-3"
              value={form.taxConfig.gstPercent}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  taxConfig: {
                    ...prev.taxConfig,
                    gstPercent: Number(e.target.value),
                  },
                }))
              }
            >
              {gstOptions.map((value) => (
                <option key={value} value={value}>
                  GST {value}%
                </option>
              ))}
            </select>
          ) : null}

          <textarea
            className="w-full min-h-24 rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, notes: e.target.value }))
            }
          />
        </section>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            disabled={saving}
            className="h-11 w-full sm:w-auto px-5 rounded-lg bg-gray-800 text-white disabled:opacity-60"
            onClick={() => saveQuotation("draft", false)}
          >
            {saving ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="button"
            disabled={saving}
            className="h-11 w-full sm:w-auto px-5 rounded-lg bg-blue-600 text-white disabled:opacity-60"
            onClick={() => saveQuotation("sent", true)}
          >
            {saving ? "Saving..." : "Save & Preview"}
          </button>
        </div>

        {saveError ? (
          <p className="text-sm text-red-600 mt-2">{saveError}</p>
        ) : null}
      </div>

      <div className="lg:sticky lg:top-24 space-y-4">
        <QuotationSummary
          subtotal={totals.subtotal}
          gstAmount={totals.gstAmount}
          grandTotal={totals.grandTotal}
          taxType={form.taxConfig.type}
          gstPercent={Number(form.taxConfig.gstPercent || 0)}
        />
      </div>
    </div>
  );
};

export default QuotationForm;

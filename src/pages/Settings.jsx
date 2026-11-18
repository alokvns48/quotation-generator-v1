import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const tabs = [
  { key: "firm", label: "Firm Profile" },
  { key: "users", label: "Users" },
];

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("firm");
  const [firm, setFirm] = useState({
    firmName: "",
    address: "",
    gstin: "",
    mobile: "",
    email: "",
    logoUrl: "",
    businessDomain: "",
    headerSizes: {
      gstin: 18,
      mobile: 18,
      firmName: 46,
      address: 24,
      businessDomain: 13,
    },
    defaultGST: 18,
  });
  const [users, setUsers] = useState([]);
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const loadFirm = async () => {
    const { data } = await api.get("/api/firm");
    setFirm((prev) => ({ ...prev, ...data }));
  };

  const loadUsers = async () => {
    if (user?.role !== "owner") return;
    const { data } = await api.get("/api/users");
    setUsers(data || []);
  };

  useEffect(() => {
    loadFirm();
    loadUsers();
  }, []);

  const updateFirm = async (e) => {
    e.preventDefault();
    await api.put("/api/firm", firm);
    await loadFirm();
  };

  const addStaff = async (e) => {
    e.preventDefault();
    await api.post("/api/users/invite", { ...staffForm, role: "staff" });
    setStaffForm({ name: "", email: "", password: "" });
    loadUsers();
  };

  const deleteUser = async (id) => {
    await api.delete(`/api/users/${id}`);
    loadUsers();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full sm:min-w-0 gap-2 rounded-xl bg-white border border-gray-200 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`h-11 px-4 rounded-lg text-sm font-medium whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "firm" ? (
        <form
          onSubmit={updateFirm}
          className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6 space-y-3 max-w-none lg:max-w-md"
        >
          <input
            className="h-11 w-full rounded-lg border border-gray-300 px-3"
            placeholder="Firm Name"
            value={firm.firmName}
            onChange={(e) =>
              setFirm((f) => ({ ...f, firmName: e.target.value }))
            }
          />
          <input
            className="h-11 w-full rounded-lg border border-gray-300 px-3"
            placeholder="Address"
            value={firm.address}
            onChange={(e) =>
              setFirm((f) => ({ ...f, address: e.target.value }))
            }
          />
          <input
            className="h-11 w-full rounded-lg border border-gray-300 px-3"
            placeholder="GSTIN"
            value={firm.gstin}
            onChange={(e) => setFirm((f) => ({ ...f, gstin: e.target.value }))}
          />
          <input
            className="h-11 w-full rounded-lg border border-gray-300 px-3"
            placeholder="Mobile"
            value={firm.mobile}
            onChange={(e) => setFirm((f) => ({ ...f, mobile: e.target.value }))}
          />
          <input
            className="h-11 w-full rounded-lg border border-gray-300 px-3"
            placeholder="Email"
            value={firm.email}
            onChange={(e) => setFirm((f) => ({ ...f, email: e.target.value }))}
          />
          <input
            className="h-11 w-full rounded-lg border border-gray-300 px-3"
            placeholder="Logo URL"
            value={firm.logoUrl}
            onChange={(e) =>
              setFirm((f) => ({ ...f, logoUrl: e.target.value }))
            }
          />
          <input
            className="h-11 w-full rounded-lg border border-gray-300 px-3"
            placeholder="Business Domain (e.g. Furniture)"
            value={firm.businessDomain}
            onChange={(e) =>
              setFirm((f) => ({ ...f, businessDomain: e.target.value }))
            }
          />
          <div className="rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-800">
              Header Size (px)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="h-11 rounded-lg border border-gray-300 px-3"
                placeholder="GSTIN Size"
                type="number"
                value={firm.headerSizes?.gstin ?? 18}
                onChange={(e) =>
                  setFirm((f) => ({
                    ...f,
                    headerSizes: {
                      ...(f.headerSizes || {}),
                      gstin: Number(e.target.value),
                    },
                  }))
                }
              />
              <input
                className="h-11 rounded-lg border border-gray-300 px-3"
                placeholder="Mobile Size"
                type="number"
                value={firm.headerSizes?.mobile ?? 18}
                onChange={(e) =>
                  setFirm((f) => ({
                    ...f,
                    headerSizes: {
                      ...(f.headerSizes || {}),
                      mobile: Number(e.target.value),
                    },
                  }))
                }
              />
              <input
                className="h-11 rounded-lg border border-gray-300 px-3"
                placeholder="Firm Name Size"
                type="number"
                value={firm.headerSizes?.firmName ?? 46}
                onChange={(e) =>
                  setFirm((f) => ({
                    ...f,
                    headerSizes: {
                      ...(f.headerSizes || {}),
                      firmName: Number(e.target.value),
                    },
                  }))
                }
              />
              <input
                className="h-11 rounded-lg border border-gray-300 px-3"
                placeholder="Address Size"
                type="number"
                value={firm.headerSizes?.address ?? 24}
                onChange={(e) =>
                  setFirm((f) => ({
                    ...f,
                    headerSizes: {
                      ...(f.headerSizes || {}),
                      address: Number(e.target.value),
                    },
                  }))
                }
              />
              <input
                className="h-11 rounded-lg border border-gray-300 px-3 sm:col-span-2"
                placeholder="Business Domain Size"
                type="number"
                value={firm.headerSizes?.businessDomain ?? 13}
                onChange={(e) =>
                  setFirm((f) => ({
                    ...f,
                    headerSizes: {
                      ...(f.headerSizes || {}),
                      businessDomain: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
          </div>
          <input
            className="h-11 w-full rounded-lg border border-gray-300 px-3"
            placeholder="Default GST"
            type="number"
            value={firm.defaultGST}
            onChange={(e) =>
              setFirm((f) => ({ ...f, defaultGST: Number(e.target.value) }))
            }
          />
          <button className="h-11 w-full sm:w-auto sm:px-4 rounded-lg bg-blue-600 text-white">
            Save Profile
          </button>
        </form>
      ) : null}

      {activeTab === "users" ? (
        <div className="space-y-4">
          {user?.role === "owner" ? (
            <form
              onSubmit={addStaff}
              className="bg-white border border-gray-200 rounded-2xl p-4 lg:p-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <input
                className="h-11 rounded-lg border border-gray-300 px-3"
                placeholder="Name"
                value={staffForm.name}
                onChange={(e) =>
                  setStaffForm((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
              <input
                className="h-11 rounded-lg border border-gray-300 px-3"
                placeholder="Email"
                type="email"
                value={staffForm.email}
                onChange={(e) =>
                  setStaffForm((p) => ({ ...p, email: e.target.value }))
                }
                required
              />
              <input
                className="h-11 rounded-lg border border-gray-300 px-3"
                placeholder="Password"
                type="password"
                value={staffForm.password}
                onChange={(e) =>
                  setStaffForm((p) => ({ ...p, password: e.target.value }))
                }
                required
              />
              <button className="h-11 w-full sm:w-auto sm:px-4 rounded-lg bg-slate-900 text-white">
                Add Staff
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-600">
              Only owner can manage users.
            </p>
          )}

          <div className="space-y-3 lg:hidden">
            {users.map((staff) => (
              <div
                key={staff._id}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <p className="font-semibold">{staff.name}</p>
                <p className="text-sm text-gray-600">{staff.email}</p>
                <p className="text-xs text-gray-500 uppercase">{staff.role}</p>
                {staff.role !== "owner" ? (
                  <button
                    className="mt-2 text-red-600"
                    onClick={() => deleteUser(staff._id)}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl p-4 lg:p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((staff) => (
                  <tr key={staff._id} className="border-b border-gray-100">
                    <td className="py-3">{staff.name}</td>
                    <td className="py-3">{staff.email}</td>
                    <td className="py-3 uppercase text-xs">{staff.role}</td>
                    <td className="py-3">
                      {staff.role !== "owner" ? (
                        <button
                          className="text-red-600"
                          onClick={() => deleteUser(staff._id)}
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Settings;

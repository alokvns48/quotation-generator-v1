import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  firmName: "",
  address: "",
  gstin: "",
  mobile: "",
  name: "",
  email: "",
  password: "",
};

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-lg border border-gray-200 space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-900">Register Firm</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="h-11 rounded-lg border border-gray-300 px-3"
            name="firmName"
            placeholder="Firm Name"
            value={form.firmName}
            onChange={handleChange}
            required
          />
          <input
            className="h-11 rounded-lg border border-gray-300 px-3"
            name="mobile"
            placeholder="Firm Mobile"
            value={form.mobile}
            onChange={handleChange}
          />
          <input
            className="h-11 rounded-lg border border-gray-300 px-3 sm:col-span-2"
            name="address"
            placeholder="Firm Address"
            value={form.address}
            onChange={handleChange}
          />
          <input
            className="h-11 rounded-lg border border-gray-300 px-3"
            name="gstin"
            placeholder="GSTIN"
            value={form.gstin}
            onChange={handleChange}
          />
          <input
            className="h-11 rounded-lg border border-gray-300 px-3"
            name="name"
            placeholder="Owner Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="h-11 rounded-lg border border-gray-300 px-3"
            type="email"
            name="email"
            placeholder="Owner Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="h-11 rounded-lg border border-gray-300 px-3"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="h-11 w-full sm:w-auto sm:px-6 rounded-lg bg-blue-600 text-white font-medium"
        >
          {submitting ? "Creating..." : "Create Account"}
        </button>

        <p className="text-sm text-gray-600">
          Already registered?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

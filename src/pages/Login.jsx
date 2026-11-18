import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
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
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg border border-gray-200 space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-900">Login</h1>

        <label className="block">
          <span className="text-sm text-gray-700">Email</span>
          <input
            className="mt-1 w-full h-11 rounded-lg border border-gray-300 px-3"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">Password</span>
          <input
            className="mt-1 w-full h-11 rounded-lg border border-gray-300 px-3"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="h-11 w-full sm:w-auto sm:px-6 rounded-lg bg-blue-600 text-white font-medium"
        >
          {submitting ? "Signing in..." : "Login"}
        </button>

        <p className="text-sm text-gray-600">
          New business?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

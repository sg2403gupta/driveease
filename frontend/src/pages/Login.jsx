import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { validateEmail } from "../utils/validators";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(formData);
      login(response.data.user, response.data.token);

      response.data.user.role === "admin"
        ? navigate("/admin/dashboard")
        : navigate("/vehicles");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary-light px-4 dark:bg-bg-primary-dark">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded border border-border-light bg-bg-surface-light p-8 dark:border-border-dark dark:bg-bg-surface-dark">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
              Login to continue to DriveEase
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2 rounded border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Your Email"
                  className="w-full rounded border border-border-light bg-bg-surface-light py-2.5 pl-10 pr-4 text-sm
                             text-text-primary-light focus:outline-none focus:ring-2 focus:ring-accent
                             dark:border-border-dark dark:bg-bg-surface-dark dark:text-text-primary-dark"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded border border-border-light bg-bg-surface-light py-2.5 pl-10 pr-4 text-sm
                             text-text-primary-light focus:outline-none focus:ring-2 focus:ring-accent
                             dark:border-border-dark dark:bg-bg-surface-dark dark:text-text-primary-dark"
                  required
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-accent hover:underline"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div
          className="mt-6 rounded border border-border-light bg-bg-muted-light p-4 text-xs
                        text-text-muted-light dark:border-border-dark dark:bg-bg-muted-dark dark:text-text-muted-dark"
        >
          <p className="mb-1 font-semibold text-text-primary-light dark:text-text-primary-dark">
            Demo credentials
          </p>
          <p>User: rahul123@demo.com / password123</p>
          <p>Admin: shubham123@demo.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

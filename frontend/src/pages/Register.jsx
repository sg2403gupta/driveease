import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, AlertCircle } from "lucide-react";
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import {
  validateEmail,
  validatePhone,
  validatePassword,
} from "../utils/validators";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (formData.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";

    if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!validatePhone(formData.phone))
      newErrors.phone = "Please enter a valid mobile number";

    if (!validatePassword(formData.password))
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const res = await registerUser(payload);
      login(res.data.user, res.data.token);
      navigate("/vehicles");
    } catch (err) {
      setErrors({
        submit:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary-light px-4 dark:bg-bg-primary-dark">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-bg-surface-light p-8 shadow-lg dark:bg-bg-surface-dark">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
              Get started with DriveEase in less than a minute
            </p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-5 flex items-start gap-2 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Your name"
              name="name"
              icon={<User />}
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter Your Name"
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              icon={<Mail />}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter Your Email"
            />

            <InputField
              label="Mobile number"
              name="phone"
              icon={<Phone />}
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="10-digit mobile number"
              maxLength={10}
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              icon={<Lock />}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
            />

            <InputField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              icon={<Lock />}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white transition
                         hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-medium text-accent hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ===== Reusable Input ===== */
const InputField = ({
  label,
  name,
  type = "text",
  icon,
  value,
  onChange,
  error,
  placeholder,
  maxLength,
}) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm
          bg-bg-surface-light text-text-primary-light
          focus:outline-none focus:ring-2 focus:ring-accent
          dark:bg-bg-surface-dark dark:text-text-primary-dark
          ${
            error
              ? "border-red-500"
              : "border-border-light dark:border-border-dark"
          }
        `}
        required
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export default Register;

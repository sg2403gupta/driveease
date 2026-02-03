import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Users,
  Package,
  IndianRupee,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { getDashboardStats } from "../api/paymentApi";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatCurrency } from "../utils/helpers";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      setStats(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
        <Loader text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
        <ErrorMessage message={error} onRetry={fetchStats} />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Vehicles",
      value: stats.overview.totalVehicles,
      icon: <Car className="h-6 w-6" />,
      link: "/admin/vehicles",
    },
    {
      title: "Available Vehicles",
      value: stats.overview.availableVehicles,
      icon: <Car className="h-6 w-6" />,
      link: "/admin/vehicles",
    },
    {
      title: "Total Bookings",
      value: stats.overview.totalBookings,
      icon: <Package className="h-6 w-6" />,
      link: "/admin/bookings",
    },
    {
      title: "Total Users",
      value: stats.overview.totalUsers,
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.overview.totalRevenue),
      icon: <IndianRupee className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary-light py-8 dark:bg-bg-primary-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Admin Dashboard
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Overview of your vehicle rental platform
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="rounded-lg bg-bg-surface-light p-6 shadow-md transition-smooth hover:shadow-lg dark:bg-bg-surface-dark"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-accent">{stat.value}</p>
                </div>
                <div className="rounded-full bg-accent/10 p-3 text-accent">
                  {stat.icon}
                </div>
              </div>

              {stat.link && (
                <Link
                  to={stat.link}
                  className="mt-4 inline-block text-sm text-accent hover:underline"
                >
                  View Details →
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Breakdown */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Booking Status */}
          <div className="rounded-lg bg-bg-surface-light p-6 shadow-md dark:bg-bg-surface-dark">
            <h2 className="mb-4 text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Booking Status
            </h2>
            <div className="space-y-3">
              {[
                ["Pending", "bg-yellow-500", stats.bookingStatus.pending],
                ["Confirmed", "bg-green-500", stats.bookingStatus.confirmed],
                ["Completed", "bg-blue-500", stats.bookingStatus.completed],
                ["Cancelled", "bg-red-500", stats.bookingStatus.cancelled],
              ].map(([label, color, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg bg-bg-primary-light p-3 dark:bg-bg-primary-dark"
                >
                  <span className="text-text-muted-light dark:text-text-muted-dark">
                    {label}
                  </span>
                  <span
                    className={`${color} rounded-full px-3 py-1 text-sm font-medium text-white`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicles by Type */}
          <div className="rounded-lg bg-bg-surface-light p-6 shadow-md dark:bg-bg-surface-dark">
            <h2 className="mb-4 text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Vehicles by Type
            </h2>
            <div className="space-y-3">
              {stats.vehiclesByType.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between rounded-lg bg-bg-primary-light p-3 capitalize dark:bg-bg-primary-dark"
                >
                  <span className="text-text-muted-light dark:text-text-muted-dark">
                    {item._id}
                  </span>
                  <span className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-white">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-bg-surface-light p-6 shadow-md dark:bg-bg-surface-dark">
          <h2 className="mb-4 text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              to="/admin/vehicles"
              className="rounded-lg bg-accent p-4 text-center text-white transition-smooth hover:opacity-90"
            >
              <Car className="mx-auto mb-2 h-8 w-8" />
              <span className="font-medium">Manage Vehicles</span>
            </Link>

            <Link
              to="/admin/bookings"
              className="rounded-lg bg-accent p-4 text-center text-white transition-smooth hover:opacity-90"
            >
              <Calendar className="mx-auto mb-2 h-8 w-8" />
              <span className="font-medium">View Bookings</span>
            </Link>

            <button
              onClick={fetchStats}
              className="rounded-lg border border-accent/40 p-4 text-center text-accent transition-smooth hover:bg-accent/10"
            >
              <TrendingUp className="mx-auto mb-2 h-8 w-8" />
              <span className="font-medium">Refresh Stats</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

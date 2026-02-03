import React, { useState, useEffect } from "react";
import {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../api/vehicleApi";
import VehicleForm from "../components/vehicle/VehicleForm";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { formatCurrency } from "../utils/helpers";
import { getImageUrl } from "../utils/image";

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await getAllVehicles();
      setVehicles(res.data.vehicles);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;

    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete vehicle");
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);

    try {
      if (editingVehicle) {
        const res = await updateVehicle(editingVehicle._id, formData);
        setVehicles((prev) =>
          prev.map((v) =>
            v._id === editingVehicle._id ? res.data.vehicle : v,
          ),
        );
      } else {
        const res = await createVehicle(formData);
        setVehicles((prev) => [res.data.vehicle, ...prev]);
      }

      setShowForm(false);
      setEditingVehicle(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save vehicle");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
        <Loader text="Loading vehicles..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
        <ErrorMessage message={error} onRetry={fetchVehicles} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary-light py-8 dark:bg-bg-primary-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Manage Vehicles
            </h1>
            <p className="text-text-muted-light dark:text-text-muted-dark">
              Add, edit, or delete vehicles from your inventory
            </p>
          </div>

          {!showForm && (
            <button
              onClick={handleAddVehicle}
              className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-white transition hover:opacity-90"
            >
              <Plus className="h-5 w-5" />
              <span>Add Vehicle</span>
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-lg bg-bg-surface-light p-6 shadow-xl dark:bg-bg-surface-dark">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingVehicle(null);
                }}
                className="text-text-muted-light hover:text-text-primary-light dark:text-text-muted-dark dark:hover:text-text-primary-dark"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <VehicleForm
              initialData={editingVehicle}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingVehicle(null);
              }}
              isLoading={formLoading}
            />
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-bg-surface-light shadow-md dark:bg-bg-surface-dark">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent text-white">
                <tr>
                  {[
                    "Image",
                    "Vehicle",
                    "Type",
                    "Price / Day",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-sm font-semibold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                {vehicles.map((vehicle) => (
                  <tr
                    key={vehicle._id}
                    className="transition hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={getImageUrl(vehicle.image)}
                        alt={vehicle.name}
                        className="h-16 w-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-vehicle.webp";
                        }}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary-light dark:text-text-primary-dark">
                        {vehicle.brand} {vehicle.model}
                      </div>
                      <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        {vehicle.year}
                      </div>
                    </td>

                    <td className="px-6 py-4 capitalize text-text-muted-light dark:text-text-muted-dark">
                      {vehicle.type}
                    </td>

                    <td className="px-6 py-4 text-text-muted-light dark:text-text-muted-dark">
                      {formatCurrency(vehicle.pricePerDay)}
                    </td>

                    <td className="px-6 py-4">
                      {vehicle.isAvailable ? (
                        <span className="rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                          Available
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                          Unavailable
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditVehicle(vehicle)}
                          className="text-accent hover:opacity-80"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {vehicles.length === 0 && (
            <div className="py-12 text-center text-text-muted-light dark:text-text-muted-dark">
              No vehicles found. Add your first vehicle to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageVehicles;

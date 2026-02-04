import React, { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";
import { getAllVehicles } from "../api/vehicleApi";
import VehicleCard from "../components/vehicle/VehicleCard";
import VehicleFilter from "../components/vehicle/VehicleFilter";
import ErrorMessage from "../components/common/ErrorMessage";
import VehicleCardSkeleton from "../components/common/VehicleCardSkeleton";
import { useDebounce } from "../hooks/useDebounce";

const ITEMS_PER_PAGE = 8;

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedType, setSelectedType] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  /* Debounced search (CORRECT PLACE) */
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await getAllVehicles();
      setVehicles(res.data.vehicles || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FILTER + SEARCH (FAST)
  ========================== */
  const filteredVehicles = useMemo(() => {
    let result = vehicles;

    if (selectedType) {
      result = result.filter((v) => v.type === selectedType);
    }

    if (availableOnly) {
      result = result.filter((v) => v.isAvailable);
    }

    if (debouncedSearch.trim()) {
      const keyword = debouncedSearch.toLowerCase();
      result = result.filter((v) =>
        `${v.name} ${v.brand} ${v.model} ${v.description || ""}`
          .toLowerCase()
          .includes(keyword),
      );
    }

    return result;
  }, [vehicles, selectedType, availableOnly, debouncedSearch]);

  /* =========================
     ERROR STATE
  ========================== */
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary-light dark:bg-bg-primary-dark">
        <ErrorMessage message={error} onRetry={fetchVehicles} />
      </div>
    );
  }

  /* =========================
     UI
  ========================== */
  return (
    <div className="min-h-screen bg-bg-primary-light py-10 dark:bg-bg-primary-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="mb-8">
          <h1 className="mb-1 text-3xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Available Vehicles
          </h1>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Browse and book from our wide selection of vehicles
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              placeholder="Search vehicles..."
              className="w-full rounded border border-border-light bg-bg-surface-light py-2 pl-9 pr-4 text-sm
                         text-text-primary-light focus:outline-none focus:ring-2 focus:ring-accent
                         dark:border-border-dark dark:bg-bg-surface-dark dark:text-text-primary-dark"
            />
          </div>

          {/* Filters */}
          <VehicleFilter
            selectedType={selectedType}
            onTypeChange={(val) => {
              setSelectedType(val);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            availableOnly={availableOnly}
            onAvailableChange={(val) => {
              setAvailableOnly(val);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
          />
        </div>

        {/* Result Count */}
        {!loading && (
          <div className="mb-4 text-sm text-text-muted-light dark:text-text-muted-dark">
            Showing {Math.min(visibleCount, filteredVehicles.length)} of{" "}
            {filteredVehicles.length} vehicles
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="py-16 text-center text-text-muted-light dark:text-text-muted-dark">
            No vehicles found matching your criteria
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredVehicles.slice(0, visibleCount).map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>

            {/* Load More */}
            {visibleCount < filteredVehicles.length && (
              <div className="mt-10 text-center">
                <button
                  onClick={() =>
                    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                  }
                  className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleList;

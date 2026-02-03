import React from "react";
import { VEHICLE_TYPES } from "../../utils/constants";

const VehicleFilter = ({
  selectedType,
  onTypeChange,
  availableOnly,
  onAvailableChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      {/* Vehicle Type */}
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="rounded border border-border-light bg-bg-surface-light px-3 py-2 text-sm
                   text-text-primary-light focus:outline-none focus:ring-1 focus:ring-accent
                   dark:border-border-dark dark:bg-bg-surface-dark dark:text-text-primary-dark"
      >
        <option value="">All Types</option>
        <option value={VEHICLE_TYPES.CAR}>Car</option>
        <option value={VEHICLE_TYPES.BIKE}>Bike</option>
        <option value={VEHICLE_TYPES.SCOOTY}>Scooty</option>
      </select>

      {/* Availability */}
      <label className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark">
        <input
          type="checkbox"
          checked={availableOnly}
          onChange={(e) => onAvailableChange(e.target.checked)}
          className="h-4 w-4 rounded border-border-light text-accent focus:ring-accent
                     dark:border-border-dark"
        />
        Available only
      </label>

      {/* Clear */}
      {(selectedType || availableOnly) && (
        <button
          onClick={() => {
            onTypeChange("");
            onAvailableChange(false);
          }}
          className="text-xs font-medium uppercase tracking-wide text-accent hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default VehicleFilter;

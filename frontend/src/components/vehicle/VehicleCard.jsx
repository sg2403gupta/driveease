import React from "react";
import { Link } from "react-router-dom";
import { Car, Bike, Fuel, IndianRupee, Calendar, Check } from "lucide-react";
import { capitalizeFirst } from "../../utils/helpers";
import { getImageUrl } from "../../utils/image";

const VehicleCard = ({ vehicle }) => {
  const getVehicleIcon = () => {
    switch (vehicle.type) {
      case "car":
        return <Car className="h-4 w-4" />;
      case "bike":
      case "scooty":
        return <Bike className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded bg-bg-surface-light transition hover:shadow-soft dark:bg-bg-surface-dark">
      {/* IMAGE */}
      <div className="h-48 w-full overflow-hidden bg-bg-muted-light">
        <img
          src={getImageUrl(vehicle.image)}
          alt={`${vehicle.brand} ${vehicle.model}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-vehicle.webp";
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-4">
        {/* BADGES */}
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-xs text-accent dark:bg-white/10">
            {getVehicleIcon()}
            {capitalizeFirst(vehicle.type)}
          </span>

          <span
            className={`rounded px-2 py-0.5 text-xs font-medium ${
              vehicle.isAvailable
                ? "bg-success text-white"
                : "bg-danger text-white"
            }`}
          >
            {vehicle.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* TITLE */}
        <h3 className="mb-1 text-base font-semibold text-text-primary-light dark:text-text-primary-dark">
          {vehicle.brand} {vehicle.model}
          <span className="ml-1 text-xs font-normal text-text-muted-light dark:text-text-muted-dark">
            ({vehicle.year})
          </span>
        </h3>

        {/* DESCRIPTION */}
        <p className="mb-3 line-clamp-2 text-sm text-text-muted-light dark:text-text-muted-dark">
          {vehicle.description}
        </p>

        {/* SPECS */}
        <div className="mb-4 min-h-[72px] space-y-2 text-sm text-text-muted-light dark:text-text-muted-dark">
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            {capitalizeFirst(vehicle.fuelType)}
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {vehicle.year}
          </div>

          {vehicle.seatingCapacity && (
            <div>
              <span className="font-medium">Seats:</span>{" "}
              {vehicle.seatingCapacity}
            </div>
          )}
        </div>

        {/* FEATURES */}
        <div className="mb-4 min-h-[32px]">
          {vehicle.features?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {vehicle.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-xs text-text-muted-light dark:bg-white/10 dark:text-text-muted-dark"
                >
                  <Check className="h-3 w-3 text-accent" />
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* PRICE */}
        <div className="mb-4 flex items-center justify-between border-t border-border-light pt-3 dark:border-border-dark">
          <div className="flex items-center gap-1 text-lg font-semibold text-accent">
            <IndianRupee className="h-4 w-4" />
            {vehicle.pricePerDay}
            <span className="text-sm font-normal text-text-muted-light dark:text-text-muted-dark">
              /day
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/vehicles/${vehicle._id}`}
          className="mt-auto block w-full rounded bg-accent py-2 text-center text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-accent-hover"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;

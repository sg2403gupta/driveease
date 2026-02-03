import React from "react";

const VehicleCardSkeleton = () => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-bg-surface-light p-4 shadow-sm dark:bg-bg-surface-dark">
      {/* Image */}
      <div className="h-48 w-full animate-pulse rounded bg-black/10 dark:bg-white/10" />

      {/* Content */}
      <div className="mt-4 space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-black/10 dark:bg-white/10" />
        <div className="h-3 w-full animate-pulse rounded bg-black/10 dark:bg-white/10" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-black/10 dark:bg-white/10" />

        <div className="mt-4 space-y-2">
          <div className="h-3 w-1/2 animate-pulse rounded bg-black/10 dark:bg-white/10" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-black/10 dark:bg-white/10" />
        </div>

        <div className="mt-auto h-9 w-full animate-pulse rounded bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
};

export default VehicleCardSkeleton;

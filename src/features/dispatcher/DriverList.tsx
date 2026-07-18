import { useQuery } from "@tanstack/react-query";
import { FiPlus, FiTruck, FiCircle } from "react-icons/fi";
import { fetchDriverList } from "../../api/auth";
import { useState } from "react";
import Pagination from "../../components/ui/Pagination";

interface DriverListProps {
  onCreateClick: () => void;
}

const PAGE_SIZE = 15;

export default function DriverList({ onCreateClick }: DriverListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["driver-list", page],
    queryFn: () => fetchDriverList(page),
    refetchInterval: 15000,
  });

  const drivers = data?.results;

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Drivers</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your delivery fleet
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          New Driver
        </button>
      </div>

      {isLoading && (
        <p className="text-slate-500 text-sm">Loading drivers...</p>
      )}

      {drivers && drivers.length === 0 && (
        <div className="text-center py-16 border border-dashed border-slate-300 rounded-lg">
          <p className="text-slate-500 text-sm">
            No drivers yet. Add your first one to get started.
          </p>
        </div>
      )}

      {drivers && drivers.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className="bg-white border border-slate-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      {driver.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {driver.username}
                      </p>
                      <p className="text-xs text-slate-400">
                        {driver.phone_number}
                      </p>
                    </div>
                  </div>
                  {driver.driver_profile?.is_available ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-700">
                      <FiCircle className="w-2 h-2 fill-emerald-600 text-emerald-600" />{" "}
                      Available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <FiCircle className="w-2 h-2 fill-slate-300 text-slate-300" />{" "}
                      Offline
                    </span>
                  )}
                </div>

                {driver.driver_profile && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <FiTruck className="w-3.5 h-3.5" />
                    <span>
                      {driver.driver_profile.vehicle_type || "No vehicle set"}
                      {driver.driver_profile.vehicle_plate_number &&
                        ` · ${driver.driver_profile.vehicle_plate_number}`}
                    </span>
                  </div>
                )}

                {driver.driver_profile?.last_location_update && (
                  <p className="text-xs text-slate-400 font-mono mt-2">
                    Last seen{" "}
                    {new Date(
                      driver.driver_profile.last_location_update,
                    ).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>

          {data && (
            <Pagination
              page={page}
              totalCount={data.count}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}

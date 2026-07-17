import { useState } from "react";
import { FiPackage } from "react-icons/fi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DriverOrderList from "./DriverOrderList";
import DriverOrderDetail from "./DriverOrderDetail";

export default function DriverDashboard() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const navItems = [
    {
      label: "My Orders",
      icon: <FiPackage className="w-4 h-4" />,
      onClick: () => {},
      active: true,
    },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <DriverOrderList onOrderClick={(id) => setSelectedOrderId(id)} />
      {selectedOrderId && (
        <DriverOrderDetail
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </DashboardLayout>
  );
}

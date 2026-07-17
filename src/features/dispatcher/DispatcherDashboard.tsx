import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiGrid, FiPackage, FiUsers } from "react-icons/fi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import OrderList from "./OrderList";
import CreateOrderForm from "./CreateOrderForm";
import OrderDetail from "./OrderDetail";
import DriverList from "./DriverList";
import CreateDriverForm from "./CreateDriverForm";
import { fetchOrders } from "../../api/orders";
import { fetchDriverList } from "../../api/auth";
import Overview from "./Overview";

export default function DispatcherDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateOrderForm, setShowCreateOrderForm] = useState(false);
  const [showCreateDriverForm, setShowCreateDriverForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data: orders } = useQuery({
    queryKey: ["orders", 1],
    queryFn: () => fetchOrders(1),
  });
  const { data: drivers } = useQuery({
    queryKey: ["driver-list", 1],
    queryFn: () => fetchDriverList(1),
  });

  const navItems = [
    {
      label: "Overview",
      icon: <FiGrid className="w-full h-full" />,
      onClick: () => setActiveTab("overview"),
      active: activeTab === "overview",
    },
    {
      label: "Orders",
      icon: <FiPackage className="w-full h-full" />,
      onClick: () => setActiveTab("orders"),
      active: activeTab === "orders",
      count: orders?.count,
    },
    {
      label: "Drivers",
      icon: <FiUsers className="w-full h-full" />,
      onClick: () => setActiveTab("drivers"),
      active: activeTab === "drivers",
      count: drivers?.count,
    },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      onPrimaryAction={
        activeTab === "orders"
          ? () => setShowCreateOrderForm(true)
          : activeTab === "drivers"
            ? () => setShowCreateDriverForm(true)
            : undefined
      }
      primaryActionLabel={activeTab === "orders" ? "New Order" : "New Driver"}
    >
      {activeTab === "overview" && (
        <Overview onOrderClick={(id) => setSelectedOrderId(id)} />
      )}
      {activeTab === "orders" && (
        <OrderList onOrderClick={(id) => setSelectedOrderId(id)} />
      )}
      {activeTab === "drivers" && (
        <DriverList onCreateClick={() => setShowCreateDriverForm(true)} />
      )}

      {showCreateOrderForm && (
        <CreateOrderForm onClose={() => setShowCreateOrderForm(false)} />
      )}
      {showCreateDriverForm && (
        <CreateDriverForm onClose={() => setShowCreateDriverForm(false)} />
      )}
      {selectedOrderId && (
        <OrderDetail
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </DashboardLayout>
  );
}

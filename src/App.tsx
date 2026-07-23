import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LoginPage from "./features/auth/LoginPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DispatcherDashboard from "./features/dispatcher/DispatcherDashboard";
import DriverDashboard from "./features/driver/DriverDashboard";
import PlaceOrderPage from "./features/order-request/PlaceOrderPage";
import PublicTrackingPage from "./features/tracking/PublicTrackingPage";
import VerifyEmailPage from "./features/auth/VerifyEmailPage";
import AcceptInvitePage from "./features/auth/AcceptInvitePage";
import LandingPage from "./features/landing/LandingPage";

function HomeRoute() {
  const { role } = useAuth();
  if (role === "dispatcher") return <DispatcherDashboard />;
  if (role === "driver") return <DriverDashboard />;
  return null;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/accept-invite/:token" element={<AcceptInvitePage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/place-order" element={<PlaceOrderPage />} />
        <Route path="/track/:token" element={<PublicTrackingPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomeRoute />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

import { Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import AboutPage from "./pages/AboutPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"

// Client pages
import ClientPersonalPage from "./pages/client/PersonalPage"
import ClientAnalyticsPage from "./pages/client/AnalyticsPage"

// Admin pages
import AdminPersonalPage from "./pages/admin/PersonalPage"
import AdminAnalyticsPage from "./pages/admin/AnalyticsPage"
import AdminUsersPage from "./pages/admin/UsersPage"

// Supplier pages
import SupplierPersonalPage from "./pages/supplier/PersonalPage"
import SupplierStockPage from "./pages/supplier/StockPage"
import SupplierOrdersPage from "./pages/supplier/OrdersPage"
import SupplierDeliveryPage from "./pages/supplier/DeliveryPage"

// Logistics pages
import LogisticsVehiclesPage from "./pages/logistics/VehiclesPage"

// Pharmacy Owner pages
import PharmacyOwnerPersonalPage from "./pages/pharmacy-owner/PersonalPage"
import PharmacyOwnerCashiersPage from "./pages/pharmacy-owner/CashiersPage"

// Cashier pages
import CashierPOSPage from "./pages/cashier/POSPage"

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Client routes */}
      <Route path="/client/personal" element={<ClientPersonalPage />} />
      <Route path="/client/analytics" element={<ClientAnalyticsPage />} />

      {/* Admin routes */}
      <Route path="/admin/personal" element={<AdminPersonalPage />} />
      <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />

      {/* Supplier routes */}
      <Route path="/supplier/personal" element={<SupplierPersonalPage />} />
      <Route path="/supplier/stock" element={<SupplierStockPage />} />
      <Route path="/supplier/orders" element={<SupplierOrdersPage />} />
      <Route path="/supplier/delivery" element={<SupplierDeliveryPage />} />

      {/* Logistics routes */}
      <Route path="/logistics/vehicles" element={<LogisticsVehiclesPage />} />

      {/* Pharmacy Owner routes */}
      <Route path="/pharmacy-owner/personal" element={<PharmacyOwnerPersonalPage />} />
      <Route path="/pharmacy-owner/cashiers" element={<PharmacyOwnerCashiersPage />} />

      {/* Cashier routes */}
      <Route path="/cashier/pos" element={<CashierPOSPage />} />
    </Routes>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import Register from "@/react-app/pages/Register";
import NGODashboard from "@/react-app/pages/NGODashboard";
import BuyerDashboard from "@/react-app/pages/BuyerDashboard";
import AdminDashboard from "@/react-app/pages/AdminDashboard";
import TestContracts from "@/react-app/pages/TestContracts";

// ✅ import WalletProvider
import { WalletProvider } from "@/react-app/context/WalletContext";

export default function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ngo/dashboard" element={<NGODashboard />} />
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/test-contracts" element={<TestContracts />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}

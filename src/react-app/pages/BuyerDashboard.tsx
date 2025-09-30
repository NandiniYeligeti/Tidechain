// src/react-app/pages/BuyerDashboard.tsx

import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  MapPin,
  IndianRupee,
  Leaf,
  LogOut,
  Filter,
  TrendingUp,
  Download,
  Calculator,
} from "lucide-react";
import CarbonCalculator from "@/react-app/components/CarbonCalculator";
import ProjectCard from "@/react-app/components/ProjectCard";
import { WalletContext } from "@/react-app/context/WalletContext";
import jsPDF from "jspdf";
import QRCode from "qrcode";

// -------------------- Types --------------------
interface ProjectType {
  id: number;
  ngo_id: number;
  name: string;
  land_size: number;
  location: string;
  description: string | null;
  status: "pending" | "verified" | "rejected";
  price_per_credit: number;
  total_credits: number | null;
  created_at: string;
  updated_at: string;
}

interface TransactionType {
  id: number;
  project_id: number;
  project_name: string;
  location: string;
  credits_purchased: number;
  total_amount: number;
  created_at: string;
}

// -------------------- Component --------------------
export default function BuyerDashboard() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const navigate = useNavigate();

  // Wallet context
  const { address, connectWallet, disconnectWallet } =
    useContext(WalletContext);

  // Mock User
  const [user] = useState<{ name: string }>({ name: "Demo Buyer" });

  // -------------------- Mock Data --------------------
  useEffect(() => {
    const now = new Date().toISOString();

    const mockProjects: ProjectType[] = [
      {
        id: 1,
        ngo_id: 101,
        name: "Mangrove Restoration",
        land_size: 50,
        location: "Goa, India",
        description: "Planting mangroves along the coastline.",
        status: "verified",
        price_per_credit: 250,
        total_credits: 20,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        ngo_id: 102,
        name: "Ocean Cleanup Drive",
        land_size: 30,
        location: "Kerala, India",
        description: "Cleaning beaches and ocean areas.",
        status: "pending",
        price_per_credit: 300,
        total_credits: 15,
        created_at: now,
        updated_at: now,
      },
    ];

    const mockTransactions: TransactionType[] = [
      {
        id: 101,
        project_id: 1,
        project_name: "Mangrove Restoration",
        location: "Goa, India",
        credits_purchased: 20,
        total_amount: 5000,
        created_at: now,
      },
    ];

    setProjects(mockProjects);
    setTransactions(mockTransactions);
    setIsLoading(false);
  }, []);

  // -------------------- Handlers --------------------
  const handlePurchase = (projectId: number, credits: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const newTx: TransactionType = {
      id: Date.now(),
      project_id: projectId,
      project_name: project.name,
      location: project.location,
      credits_purchased: credits,
      total_amount: credits * project.price_per_credit,
      created_at: new Date().toISOString(),
    };

    setTransactions((prev) => [...prev, newTx]);
    alert(`Successfully purchased ${credits} credits!`);
  };

  const handleCalculatorPurchase = (suggestedCredits: number) => {
    if (projects.length > 0) {
      handlePurchase(projects[0].id, suggestedCredits);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleDownloadCertificate = async (transactionId: number) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    if (!transaction) return;

    const certificateId = `TKN-${transaction.id}`;
    const purchaser = user?.name || "Company Name";
    const projectName = transaction.project_name;
    const creditsRetired = transaction.credits_purchased;
    const creditsLabel = `${creditsRetired} Metric Tons of CO₂e`;
    const issueDate = new Date(transaction.created_at);
    const issueDateStr = issueDate.toLocaleDateString();
    const location = transaction.location;

    const verificationPayload = {
      certificateId,
      purchaser,
      projectName,
      creditsRetired,
      issuedAt: issueDate.toISOString(),
      txId: transaction.id,
    };

    let qrDataUrl = "";
    try {
      qrDataUrl = await QRCode.toDataURL(JSON.stringify(verificationPayload), {
        margin: 1,
        scale: 6,
      });
    } catch (err) {
      console.error("QR generation failed", err);
    }

    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
      orientation: "landscape",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(24);
    doc.text("Certificate of Carbon Offset and Retirement", pageWidth / 2, 100, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.text(`Certificate ID: ${certificateId}`, 60, 160);
    doc.text(`Purchaser: ${purchaser}`, 60, 180);
    doc.text(`Project: ${projectName}`, 60, 200);
    doc.text(`Credits Retired: ${creditsLabel}`, 60, 220);
    doc.text(`Location: ${location}`, 60, 240);
    doc.text(`Issued: ${issueDateStr}`, 60, 260);

    if (qrDataUrl) {
      doc.addImage(qrDataUrl, "PNG", pageWidth - 200, 160, 120, 120);
    }

    doc.save(`Carbon_Certificate_${certificateId}.pdf`);
  };

  // -------------------- Stats --------------------
  const totalCredits = transactions.reduce(
    (sum, t) => sum + t.credits_purchased,
    0
  );
  const totalSpent = transactions.reduce((sum, t) => sum + t.total_amount, 0);
  const totalProjects = new Set(transactions.map((t) => t.project_id)).size;

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "verified") return project.status === "verified";
    return true;
  });

  // -------------------- Render --------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600 mr-8">
                TideChain
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Company Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className="text-gray-600 hover:text-gray-800 flex items-center"
              >
                <Calculator size={20} className="mr-1" />
                Calculator
              </button>
              {address ? (
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Disconnect ({address.slice(0, 6)}...{address.slice(-4)})
                </button>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Connect Wallet
                </button>
              )}
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <Leaf className="text-green-600" size={24} />
            <div className="ml-4">
              <p className="text-2xl font-bold">{totalCredits}</p>
              <p className="text-sm text-gray-600">Credits Purchased</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <IndianRupee className="text-blue-600" size={24} />
            <div className="ml-4">
              <p className="text-2xl font-bold">₹{totalSpent}</p>
              <p className="text-sm text-gray-600">Total Invested</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <MapPin className="text-purple-600" size={24} />
            <div className="ml-4">
              <p className="text-2xl font-bold">{totalProjects}</p>
              <p className="text-sm text-gray-600">Projects Supported</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
            <TrendingUp className="text-orange-600" size={24} />
            <div className="ml-4">
              <p className="text-2xl font-bold">{totalCredits}</p>
              <p className="text-sm text-gray-600">Tons CO₂ Offset</p>
            </div>
          </div>
        </div>

        {/* Calculator */}
        {showCalculator && (
          <div className="mb-8">
            <CarbonCalculator onPurchase={handleCalculatorPurchase} />
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <nav className="flex space-x-8 px-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("projects")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "projects"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              Available Projects
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "transactions"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              My Purchases
            </button>
          </nav>
        </div>

        {/* Projects */}
        {activeTab === "projects" && (
          <>
            <div className="flex items-center space-x-4 mb-6">
              <Filter className="text-gray-400" size={20} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Projects</option>
                <option value="verified">Verified Only</option>
              </select>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    userRole="buyer"
                    onPurchase={handlePurchase}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Transactions */}
        {activeTab === "transactions" && (
          <div className="bg-white rounded-lg shadow-sm">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No purchases yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start by purchasing carbon credits from verified projects.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Credits
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Certificate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.project_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.location}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.credits_purchased} tons
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ₹{transaction.total_amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              handleDownloadCertificate(transaction.id)
                            }
                            className="inline-flex items-center text-green-600 hover:text-green-700"
                          >
                            <Download size={16} className="mr-1" />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

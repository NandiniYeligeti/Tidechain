import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, MapPin, Sprout, DollarSign, LogOut, CheckCircle } from "lucide-react";
import ProjectForm from "@/react-app/components/ProjectForm";
import ProjectCard from "@/react-app/components/ProjectCard";
import { ProjectType, UserType } from "@/shared/types";
import { WalletContext } from "@/react-app/context/WalletContext";

export default function NGODashboard() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();

  const { address, connectWallet, disconnectWallet } = useContext(WalletContext);

  useEffect(() => {
    const now = new Date().toISOString();

    // ✅ Mock user with all required fields
    const mockUser: UserType = {
      id: 1,
      name: "Demo NGO",
      role: "ngo",
      email: "demo@ngo.org",
      created_at: now,
    };
    setUser(mockUser);

    // ✅ Mock projects with all required fields
    setProjects([
      {
        id: 1,
        name: "Mangrove Restoration",
        ngo_id: mockUser.id,
        land_size: 50,
        location: "Kerala, India",
        description: "Restoring coastal mangroves",
        status: "verified",
        price_per_credit: 10,
        total_credits: 500,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        name: "Wetland Protection",
        ngo_id: mockUser.id,
        land_size: 30,
        location: "Goa, India",
        description: "Protecting natural wetlands",
        status: "pending",
        price_per_credit: 12,
        total_credits: 360,
        created_at: now,
        updated_at: now,
      },
    ]);
  }, []);

  // ✅ Correctly typed handleProjectCreated
  const handleProjectCreated = (newProject: ProjectType) => {
    const now = new Date().toISOString();
    setProjects((prev) => [
      ...prev,
      {
        ...newProject,
        id: prev.length + 1,
        ngo_id: user?.id || 0,
        location: newProject.location || "Unknown",
        price_per_credit: newProject.price_per_credit || 10,
        total_credits: newProject.total_credits || null,
        created_at: now,
        updated_at: now,
        status: "pending",
      },
    ]);
    setShowCreateProject(false);
  };

  const handleLogout = () => navigate("/");

  const totalCreditsGenerated = projects
    .filter((p) => p.status === "verified")
    .reduce((sum, p) => sum + p.land_size * 25, 0);

  const totalLandProtected = projects
    .filter((p) => p.status === "verified")
    .reduce((sum, p) => sum + p.land_size, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600 mr-8">TideChain</Link>
              <h1 className="text-xl font-semibold text-gray-900">NGO Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
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
              <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats + Projects */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sprout className="text-blue-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                <p className="text-sm text-gray-600">Total Projects</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{totalCreditsGenerated.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Credits Generated</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="text-purple-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{totalLandProtected.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Acres Protected</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-orange-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter((p) => p.status === "verified").length}
                </p>
                <p className="text-sm text-gray-600">Verified Projects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Project Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateProject(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <Plus className="mr-2" size={20} />
            Create New Project
          </button>
        </div>

        {/* Create Project Form */}
        {showCreateProject && (
          <div className="mb-8">
            <ProjectForm
  onSuccess={() => setShowCreateProject(false)}
  onCancel={() => setShowCreateProject(false)}
/>

          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Sprout className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first blue carbon project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                userRole="ngo"
                onUpdate={() => {}} // noop for now
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

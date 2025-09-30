import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { CheckCircle, XCircle, Clock, Users, LogOut, Shield } from "lucide-react";
import ProjectManagementCard from "@/react-app/components/ProjectManagementCard";

// ✅ Full ProjectType mock to match your API
interface UserType {
  id: number;
  name: string;
  role: string;
  email: string;
}

interface ProjectType {
  id: number;
  name: string;
  ngo_id: number;
  land_size: number;
  location: string;
  description: string | null;
  status: "pending" | "verified" | "rejected";
  price_per_credit: number;
  total_credits: number | null;
  created_at: string;
  updated_at: string;
}

interface UpdateProjectType {
  name?: string;
  land_size?: number;
  location?: string;
  description?: string | null;
  status?: "pending" | "verified" | "rejected";
  price_per_credit?: number;
  total_credits?: number | null;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Mock user
    const mockUser: UserType = {
      id: 1,
      name: "Admin User",
      role: "admin",
      email: "admin@test.com",
    };
    setUser(mockUser);

    // ✅ Mock projects with full required fields
    const now = new Date().toISOString();
    const mockProjects: ProjectType[] = [
      {
        id: 1,
        name: "Mangrove Restoration",
        ngo_id: 101,
        land_size: 50,
        location: "Kerala, India",
        description: "Restoring mangroves along the coast",
        status: "pending",
        price_per_credit: 10,
        total_credits: 500,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        name: "Seagrass Protection",
        ngo_id: 102,
        land_size: 30,
        location: "Goa, India",
        description: "Protecting seagrass meadows",
        status: "verified",
        price_per_credit: 12,
        total_credits: 300,
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        name: "Coral Reef Monitoring",
        ngo_id: 103,
        land_size: 20,
        location: "Andaman Islands, India",
        description: "Monitoring coral reef health",
        status: "rejected",
        price_per_credit: 15,
        total_credits: 200,
        created_at: now,
        updated_at: now,
      },
    ];

    setProjects(mockProjects);
    setIsLoading(false);
  }, []);

  // ✅ Update project in local state only
  const updateProject = (projectId: number, updates: UpdateProjectType) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, ...updates } : project
      )
    );
  };

  const handleLogout = () => {
    navigate("/"); // ✅ Just redirect for now
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-500" size={20} />;
      case "verified":
        return <CheckCircle className="text-green-500" size={20} />;
      case "rejected":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "verified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const pendingProjects = projects.filter((p) => p.status === "pending");
  const verifiedProjects = projects.filter((p) => p.status === "verified");
  const rejectedProjects = projects.filter((p) => p.status === "rejected");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                <Shield className="text-white" size={20} />
              </div>
              <Link to="/" className="text-2xl font-bold mr-8">
                TideChain Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-200"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="text-blue-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {pendingProjects.length}
                </p>
                <p className="text-sm text-gray-600">Pending Reviews</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {verifiedProjects.length}
                </p>
                <p className="text-sm text-gray-600">Approved Projects</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="text-red-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {rejectedProjects.length}
                </p>
                <p className="text-sm text-gray-600">Rejected Projects</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="text-purple-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {projects.length}
                </p>
                <p className="text-sm text-gray-600">Total Projects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Verification */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Project Verification Queue
            </h3>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No projects submitted yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Projects will appear here when NGOs submit them for
                  verification.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <ProjectManagementCard
                    key={project.id}
                    project={project}
                    onUpdate={updateProject}
                    getStatusIcon={getStatusIcon}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { MapPin, Edit, Camera, ShoppingCart, Loader2 } from "lucide-react";
import { ProjectType } from "@/shared/types";
import { api } from "@/react-app/utils/api";
import ProjectForm from "@/react-app/components/ProjectForm"; // ✅ make sure this exists

interface ProjectCardProps {
  project: ProjectType;
  userRole: "ngo" | "buyer" | "admin";
  onUpdate?: () => void;
  onPurchase?: (projectId: number, credits: number) => void;
}

export default function ProjectCard({
  project,
  userRole,
  onUpdate,
  onPurchase,
}: ProjectCardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [creditsAmount, setCreditsAmount] = useState(10);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // ✅ NEW: Editing state
  const [isEditing, setIsEditing] = useState(false);

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

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await api.uploadProjectPhoto(project.id, file);
      if (response.success) {
        setPhotos([...photos, response.data]);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePurchaseClick = () => {
    if (onPurchase) {
      onPurchase(project.id, creditsAmount);
      setShowPurchaseModal(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        {isEditing ? (
          // ✅ Show ProjectForm when editing
          <ProjectForm
            project={project}
            onSuccess={() => {
              setIsEditing(false);
              if (onUpdate) onUpdate();
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {project.name}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status}
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <MapPin size={16} className="mr-2" />
              <span className="text-sm">{project.location}</span>
            </div>

            {project.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
            )}

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Land Size:</span>
                <span className="font-semibold text-gray-900">
                  {project.land_size} acres
                </span>
              </div>

              {project.total_credits && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Total Credits:</span>
                  <span className="font-semibold text-gray-900">
                    {project.total_credits.toLocaleString()} tons
                  </span>
                </div>
              )}

              {project.price_per_credit && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Price per Credit:</span>
                  <span className="font-semibold text-gray-900">
                    ₹{project.price_per_credit}
                  </span>
                </div>
              )}
            </div>

            {/* NGO Actions */}
            {userRole === "ngo" && (
              <div className="flex space-x-2">
                {/* ✅ Edit Button now works */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center justify-center"
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </button>

                <label className="flex-1 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center justify-center cursor-pointer">
                  {isUploading ? (
                    <Loader2 size={16} className="mr-1 animate-spin" />
                  ) : (
                    <Camera size={16} className="mr-1" />
                  )}
                  {isUploading ? "Uploading..." : "Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}

            {/* Buyer Actions */}
            {userRole === "buyer" && project.status === "verified" && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <ShoppingCart size={16} className="mr-1" />
                  Purchase Credits
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Purchase Modal (unchanged) */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Purchase Carbon Credits
            </h3>
            <p className="text-gray-600 mb-4">Project: {project.name}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Credits (tons CO₂)
              </label>
              <input
                type="number"
                min="1"
                max={project.total_credits || 1000}
                value={creditsAmount}
                onChange={(e) =>
                  setCreditsAmount(parseInt(e.target.value) || 1)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Credits:</span>
                <span>{creditsAmount} tons</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Price per credit:</span>
                <span>₹{project.price_per_credit}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total:</span>
                <span>
                  ₹
                  {(
                    creditsAmount * (project.price_per_credit || 25)
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchaseClick}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

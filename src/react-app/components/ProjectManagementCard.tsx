import { useState, useEffect } from "react";
import geoImage from "../assets/sample-geotagged.png";
import {
  CheckCircle,
  XCircle,
  IndianRupee,
  Eye,
  Image as ImageIcon,
  MapPin,
  BarChart3,
  Leaf,
  Factory,
  TreePine,
} from "lucide-react";
import { ProjectType, UpdateProjectType } from "@/shared/types";

interface ProjectManagementCardProps {
  project: ProjectType;
  onUpdate: (projectId: number, updates: UpdateProjectType) => void;
  getStatusIcon: (status: string) => React.ReactElement;
  getStatusColor: (status: string) => string;
}

export default function ProjectManagementCard({
  project,
  onUpdate,
  getStatusIcon,
  getStatusColor,
}: ProjectManagementCardProps) {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [showMRVReportModal, setShowMRVReportModal] = useState(false);

  const [pricePerCredit, setPricePerCredit] = useState(
    project.price_per_credit || 25
  );
  const [totalCredits, setTotalCredits] = useState(
    project.total_credits || project.land_size * 25
  );

  const [images, setImages] = useState<string[]>(project.images || []);

  useEffect(() => {
    setImages(project.images || []);
  }, [project.images]);

  const handleStatusUpdate = (status: "verified" | "rejected") => {
    onUpdate(project.id, { status });
  };

  const handlePricingUpdate = () => {
    onUpdate(project.id, {
      price_per_credit: pricePerCredit,
      total_credits: totalCredits,
    });
    setShowPricingModal(false);
  };

  const handleOpenImagesModal = () => {
    setImages(["/placeholder-geotagged.jpg"]);
    setShowImagesModal(true);
  };

  return (
    <>
      {/* Project Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.location}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              project.status
            )}`}
          >
            {getStatusIcon(project.status)} {project.status}
          </div>
        </div>

        <p className="text-sm text-gray-700 mt-2">{project.description}</p>

        {/* ✅ Assigned Credits & Price */}
        <p className="text-sm font-medium text-gray-800 mt-3">
          Assigned Credits:{" "}
          <span className="text-blue-600">{project.total_credits || 0}</span> |
          Price per Credit:{" "}
          <span className="text-green-600">
            ₹{project.price_per_credit || 25}
          </span>
        </p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowDetailsModal(true)}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium flex items-center"
          >
            <Eye size={14} className="mr-1" /> View Details
          </button>
          <button
            onClick={() => setShowPricingModal(true)}
            className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs font-medium flex items-center"
          >
            <IndianRupee size={14} className="mr-1" /> Set Pricing
          </button>
        </div>
      </div>

      {/* ✅ Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px]">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              ⚙️ Set Pricing
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price per Credit (₹)
                </label>
                <input
                  type="number"
                  value={pricePerCredit}
                  onChange={(e) => setPricePerCredit(Number(e.target.value))}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Credits
                </label>
                <input
                  type="number"
                  value={totalCredits}
                  onChange={(e) => setTotalCredits(Number(e.target.value))}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowPricingModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePricingUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Project Details</h3>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Project Name:</strong> {project.name}
              </p>
              <p>
                <strong>Location:</strong> {project.location}
              </p>
              <p>
                <strong>Description:</strong> {project.description}
              </p>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">MRV Report</h4>
                <p>
                  <strong>No. of Saplings:</strong> {project.saplings || 500}
                </p>
                <p>
                  <strong>CO₂ Consumption:</strong>{" "}
                  {project.co2_consumption || "10 tons"}
                </p>
                <p>
                  <strong>Recommended Credits:</strong>{" "}
                  {project.total_credits || "10 credits"}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleOpenImagesModal}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                >
                  <ImageIcon size={16} className="mr-1" />
                  View Geo Tagged Images
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        project.latitude && project.longitude
                          ? `${project.latitude},${project.longitude}`
                          : project.location
                      )}`,
                      "_blank"
                    )
                  }
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                >
                  <MapPin size={16} className="mr-1" />
                  View Location
                </button>

                <button
                  onClick={() => setShowMRVReportModal(true)}
                  className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                >
                  📑 View AI MRV Report
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => handleStatusUpdate("verified")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center"
              >
                <CheckCircle size={16} className="mr-1" />
                Approve
              </button>
              <button
                onClick={() => handleStatusUpdate("rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
              >
                <XCircle size={16} className="mr-1" />
                Reject
              </button>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MRV Report Modal */}
      {showMRVReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full mx-4">
            <h3 className="text-xl font-bold mb-6 flex items-center text-purple-700">
              <BarChart3 className="mr-2" /> AI Generated MRV Report
            </h3>

            {/* Existing cards (Saplings, CO2, Credits) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg shadow-sm text-center">
                <TreePine className="mx-auto mb-2 text-green-600" />
                <p className="text-sm text-gray-500">Saplings Survived</p>
                <p className="text-lg font-semibold">
                  {project.saplings || 500}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg shadow-sm text-center">
                <Factory className="mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-500">CO₂ Sequestered</p>
                <p className="text-lg font-semibold">
                  {project.co2_consumption || "10 tons"}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg shadow-sm text-center">
                <Leaf className="mx-auto mb-2 text-yellow-600" />
                <p className="text-sm text-gray-500">Carbon Credits</p>
                <p className="text-lg font-semibold">
                  {project.total_credits || 10}
                </p>
              </div>
            </div>

            {/* ✅ Show API JSON Response */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
              <h4 className="font-semibold mb-2">Raw MRV Data</h4>
              <pre className="bg-black text-green-400 p-3 rounded-lg overflow-x-auto text-xs">
                {`{
  "id": 1,
  "project_id": "TIDE001",
  "ngo": "GreenWorld",
  "plot_id": "P03",
  "area_acres": 5,
  "lat": 19.123456,
  "lon": 72.123456,
  "created_at": "2025-09-27 16:33:27"
}`}
              </pre>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowMRVReportModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Geo Tagged Images Modal */}
      {showImagesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl w-full h-[90vh] mx-4 flex flex-col">
            <h3 className="text-xl font-bold mb-6 flex items-center text-blue-700">
              <ImageIcon className="mr-2" /> View Geo-Tagged Images
            </h3>

            <div className="flex justify-center">
              <img
                src={geoImage} // 👈 make sure this is in public/geotagged.png
                alt="Geo Tagged"
                className="rounded-lg shadow-md"
                style={{ maxWidth: "100%", maxHeight: "80vh" }} // keep aspect ratio
              />
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowImagesModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

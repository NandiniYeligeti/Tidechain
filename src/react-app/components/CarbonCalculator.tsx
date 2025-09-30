import { useState } from "react";
import { Calculator, Zap, Car, Plane, Trash2, Leaf } from "lucide-react";
import { api } from "@/react-app/utils/api";
import { CarbonCalculatorType, CarbonCalculationResult } from "@/shared/types";

interface CarbonCalculatorProps {
  onPurchase?: (suggestedCredits: number) => void;
}

export default function CarbonCalculator({ onPurchase }: CarbonCalculatorProps) {
  const [formData, setFormData] = useState<CarbonCalculatorType>({
    electricity: 0,
    fuel: 0,
    flight_km: 0,
    car_km: 0,
    waste: 0
  });
  const [result, setResult] = useState<CarbonCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.calculateEmissions(formData);
      
      if (response.success && response.data) {
        setResult(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      electricity: 0,
      fuel: 0,
      flight_km: 0,
      car_km: 0,
      waste: 0
    });
    setResult(null);
    setError("");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
          <Calculator className="text-green-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Carbon Footprint Calculator</h3>
          <p className="text-sm text-gray-600">Calculate your emissions and discover how many credits you need</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleCalculate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Zap className="inline mr-2" size={16} />
              Electricity (kWh/month)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.electricity || ""}
              onChange={(e) => setFormData({ ...formData, electricity: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Car className="inline mr-2" size={16} />
              Fuel Consumption (liters/month)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.fuel || ""}
              onChange={(e) => setFormData({ ...formData, fuel: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 150"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Plane className="inline mr-2" size={16} />
              Air Travel (km/year)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={formData.flight_km || ""}
              onChange={(e) => setFormData({ ...formData, flight_km: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 5000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Car className="inline mr-2" size={16} />
              Car Travel (km/month)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={formData.car_km || ""}
              onChange={(e) => setFormData({ ...formData, car_km: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 1200"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Trash2 className="inline mr-2" size={16} />
              Waste Generation (tons/year)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.waste || ""}
              onChange={(e) => setFormData({ ...formData, waste: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 2.5"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Calculating...' : 'Calculate Emissions'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-lg font-semibold text-green-800 mb-4">Your Carbon Footprint</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Electricity:</span>
                <span>{result.electricity_emissions.toFixed(2)} kg CO₂</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fuel:</span>
                <span>{result.fuel_emissions.toFixed(2)} kg CO₂</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Air Travel:</span>
                <span>{result.flight_emissions.toFixed(2)} kg CO₂</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Car Travel:</span>
                <span>{result.car_emissions.toFixed(2)} kg CO₂</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Waste:</span>
                <span>{result.waste_emissions.toFixed(2)} kg CO₂</span>
              </div>
            </div>
          </div>

          <div className="border-t border-green-300 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-green-800">Total Emissions:</span>
              <span className="text-xl font-bold text-green-800">{result.total_emissions.toFixed(2)} tons CO₂</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
              <div className="flex items-center">
                <Leaf className="text-green-600 mr-2" size={20} />
                <span className="font-medium text-green-800">
                  Suggested Credits: {result.suggested_credits} tons
                </span>
              </div>
              
              {onPurchase && (
                <button
                  onClick={() => onPurchase(result.suggested_credits)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Purchase {result.suggested_credits} Credits
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

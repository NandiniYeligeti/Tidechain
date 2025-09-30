import { Link } from "react-router";
import { ArrowRight, Users, Building2, CheckCircle, Leaf, Globe, Shield } from "lucide-react";
import Navbar from "@/react-app/components/Navbar";
import Footer from "@/react-app/components/Footer";

export default function Home() {
  // Direct links to register with role preselected
  const ngoLink = "/register?role=ngo";
  const buyerLink = "/register?role=buyer";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Blockchain-powered blue carbon verification for global impact.
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Transform the way blue carbon credits are verified and traded through transparent, secure blockchain technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link 
                  to={ngoLink}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                >
                  Get Started
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link 
                  to="/about"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80"
                alt="Ocean conservation"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-blue-600 bg-opacity-20 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Transforming Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://mocha-cdn.com/01997304-4288-7d20-a868-4b2f99bec9c1/blue-carbon-ecosystem.jpg"
                alt="Blue carbon ecosystem"
                className="rounded-xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Transforming blue carbon credit verification
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our blockchain-powered platform ensures transparent, immutable, and efficient verification of blue carbon projects. 
                From mangrove restoration to seagrass conservation, we make environmental impact measurable and tradeable.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={24} />
                  <span className="text-gray-700">Immutable verification records</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={24} />
                  <span className="text-gray-700">Real-time project monitoring</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={24} />
                  <span className="text-gray-700">Transparent carbon credit trading</span>
                </div>
              </div>
              <Link 
                to="/projects"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                Explore Projects
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Use TideChain */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Who can use TideChain
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform connects diverse stakeholders in the blue carbon ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {/* NGOs / Communities */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="text-blue-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">NGOs / Communities</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Register and verify your blue carbon projects. Upload documentation, track progress, 
                  and generate verified carbon credits from your conservation efforts.
                </p>
                <Link 
                  to={ngoLink}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center"
                >
                  Get Started
                  <ArrowRight className="ml-2" size={16} />
                </Link>
              </div>
              <div className="h-48 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                  alt="Community conservation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Companies (Buyers) */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Building2 className="text-green-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Companies (Buyers)</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Purchase verified blue carbon credits to offset your carbon footprint. 
                  Browse projects, verify authenticity, and make a meaningful environmental impact.
                </p>
                <Link 
                  to={buyerLink}
                  className="text-green-600 font-semibold hover:text-green-700 transition-colors inline-flex items-center"
                >
                  Start Buying
                  <ArrowRight className="ml-2" size={16} />
                </Link>
              </div>
              <div className="h-48 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                  alt="Corporate sustainability"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why choose TideChain?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Blockchain Security</h3>
              <p className="text-gray-600">
                Immutable records ensure the authenticity and traceability of every carbon credit.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Impact</h3>
              <p className="text-gray-600">
                Connect local conservation efforts with global carbon markets for maximum impact.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Verified Projects</h3>
              <p className="text-gray-600">
                Every project undergoes rigorous verification to ensure real environmental benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to make a difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join the revolution in blue carbon verification. Whether you're protecting ecosystems 
            or seeking to offset your carbon footprint, TideChain makes it possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={ngoLink}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
            >
              Start a Project
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link 
              to={buyerLink}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
            >
              Purchase Credits
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

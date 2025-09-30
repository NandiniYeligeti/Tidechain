import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              TideChain
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              to="/projects"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Projects
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Login Button */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Login/Signup
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="/ngo/dashboard"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  NGO / Community
                </Link>
                <Link
                  to="/buyer/dashboard"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                >
                  Company
                </Link>
                <div className="border-t border-gray-100">
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Admin
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                  >
                    Register Company
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
              <Link
                to="/projects"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Projects
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Login as:
                </div>
                <Link
                  to="/ngo/dashboard"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  NGO / Community
                </Link>
                <Link
                  to="/buyer/dashboard"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Company (Buyer)
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

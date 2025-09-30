import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">TideChain</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              Transforming blue carbon credit verification through blockchain technology for global environmental impact.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-200 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Users</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login/ngo" className="text-blue-200 hover:text-white transition-colors text-sm">
                  NGO Login
                </Link>
              </li>
              <li>
                <Link to="/login/buyer" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Company Login
                </Link>
              </li>
              <li>
                <Link to="/register?role=ngo" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Register NGO
                </Link>
              </li>
              <li>
                <Link to="/register?role=buyer" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Register Company
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-blue-200">
              <p>info@tidechain.com</p>
              <p>+91-7304329851</p>
              <p>404Crew<br />At your service🫡</p>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm">
            © 2025 TideChain. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-blue-200 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-blue-200 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

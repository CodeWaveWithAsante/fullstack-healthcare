import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="px-6 py-12 bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold mb-4">Kinda HMS</h3>
          <p className="text-sm">
            Enterprise hospital management solution trusted by leading
            healthcare providers.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/features"
                className="hover:text-white transition-colors"
              >
                Features
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/support"
                className="hover:text-white transition-colors"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                href="/security"
                className="hover:text-white transition-colors"
              >
                Security
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm">
        <p>
          &copy; 2024 Kinda Hospital Management System. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

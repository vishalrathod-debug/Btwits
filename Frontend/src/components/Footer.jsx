export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-100 bg-white py-6 px-6 mt-auto">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center text-xs font-medium text-gray-500 sm:flex-row sm:text-left">
        
        {/* Copyright Text */}
        <p className="order-2 sm:order-1">
          &copy; {currentYear} Btwits. All rights reserved.
        </p>

        {/* Legal Links Footer Menu */}
        <nav className="order-1 flex flex-wrap justify-center gap-x-6 gap-y-2 sm:order-2">
          <a href="/privacy" className="transition-colors hover:text-gray-900 focus:outline-none focus:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="transition-colors hover:text-gray-900 focus:outline-none focus:underline">
            Terms of Service
          </a>
          <a href="/contact" className="transition-colors hover:text-gray-900 focus:outline-none focus:underline">
            Contact Support
          </a>
        </nav>
        
      </div>
    </footer>
  );
}

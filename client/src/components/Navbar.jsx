import { CampModal } from '@campnetwork/origin/react';

const Navbar = () => {
  return (
    <nav className="bg-black border-b border-gray-700 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors duration-200">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-gray-200 transition-colors duration-200">
              Imagine
            </span>
          </a>

          {/* Wallet Section */}
          <div className="flex items-center">
            <CampModal/>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
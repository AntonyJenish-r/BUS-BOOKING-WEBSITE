import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Ticket } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-2 md:py-3 flex justify-between items-center">
        
        {/* Logo Area - Ippo Image add panniruken */}
        <Link to="/" className="flex items-center">
          <img 
            src="/logo.png" 
            alt="Santony Travels" 
            className="h-10 md:h-14 w-auto object-contain" 
          />
        </Link>

        {/* Right Side Links */}
        <div className="flex items-center gap-3 md:gap-6">
          {user ? (
            <>
              {/* Logged In View */}
              <Link to="/my-bookings" className="flex items-center gap-1 md:gap-2 text-gray-600 hover:text-[#b82025] font-medium transition text-sm md:text-base">
                <Ticket size={18} />
                <span className="hidden md:inline">My Bookings</span>
              </Link>
              
              <div className="flex items-center gap-3 md:gap-4 border-l pl-3 md:pl-6 border-gray-200">
                <div className="hidden md:flex items-center gap-2 text-gray-800 font-semibold">
                  <User size={18} className="text-[#b82025]" />
                  {user.name}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition text-sm md:text-base"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Logged Out View */}
              <Link to="/login" className="text-gray-600 hover:text-[#b82025] font-medium transition text-sm md:text-base">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#b82025] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg hover:bg-[#991b1f] font-medium transition shadow-md hover:shadow-lg text-sm md:text-base"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
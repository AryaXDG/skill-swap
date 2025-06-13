import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { FaFire, FaSignOutAlt, FaUser, FaSignInAlt, FaUserPlus, FaComments, FaTachometerAlt } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const NavLinkItem = ({ to, icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-primary text-white'
            : 'text-dark-50 hover:bg-dark-700 hover:text-white'
        }`
      }
    >
      {icon}
      <span className="ml-2">{children}</span>
    </NavLink>
  );

  return (
    <nav className="bg-dark-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center text-white">
              <FaFire className="text-primary text-3xl" />
              <span className="ml-2 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                SkillSwap
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated ? (
                <>
                  <NavLinkItem to="/dashboard" icon={<FaTachometerAlt />}>Dashboard</NavLinkItem>
                  <NavLinkItem to="/chat" icon={<FaComments />}>Chat</NavLinkItem>
                  <NavLinkItem to="/profile" icon={<FaUser />}>Profile</NavLinkItem>
                </>
              ) : (
                <>
                  <NavLinkItem to="/login" icon={<FaSignInAlt />}>Login</NavLinkItem>
                  <NavLinkItem to="/register" icon={<FaUserPlus />}>Register</NavLinkItem>
                </>
              )}
            </div>
          </div>

          {/* Right side items (User menu or Logout) */}
          <div className="hidden md:block">
            {isAuthenticated && (
              <div className="ml-4 flex items-center md:ml-6">
                <span className="text-dark-50 mr-3">Hi, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-danger text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-all duration-200"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
          {/* Mobile menu button would go here */}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
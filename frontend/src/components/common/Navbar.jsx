import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X, LogOut, LayoutDashboard, ArrowLeft } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const showBackButton = location.pathname !== "/";

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-border-light bg-bg-surface-light dark:border-border-dark dark:bg-bg-surface-dark">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              {showBackButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-sm
                             text-text-muted-light transition
                             hover:bg-accent/10 hover:text-accent
                             dark:text-text-muted-dark dark:hover:bg-accent/20"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}

              <Link
                to="/"
                className="rounded-md px-2 py-1 text-lg font-semibold tracking-wide
                           text-text-primary-light transition
                           hover:bg-accent/10 hover:text-accent
                           dark:text-text-primary-dark dark:hover:bg-accent/20"
              >
                Drive<span className="text-accent">Ease</span>
              </Link>
            </div>

            {/* DESKTOP NAV */}
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/vehicles"
                className="rounded-md px-3 py-2 text-sm transition
                           hover:bg-accent/10 hover:text-accent
                           dark:hover:bg-accent/20"
              >
                Browse
              </Link>

              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-1 rounded-md px-3 py-2 text-sm transition
                                 hover:bg-accent/10 hover:text-accent
                                 dark:hover:bg-accent/20"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/my-bookings"
                      className="rounded-md px-3 py-2 text-sm transition
                                 hover:bg-accent/10 hover:text-accent
                                 dark:hover:bg-accent/20"
                    >
                      My Bookings
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 rounded-md px-3 py-2 text-sm transition
                               text-text-muted-light hover:bg-red-50 hover:text-red-600
                               dark:text-text-muted-dark dark:hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-md px-3 py-2 text-sm transition
                               hover:bg-accent/10 hover:text-accent
                               dark:hover:bg-accent/20"
                  >
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary ml-2">
                    Register
                  </Link>
                </>
              )}

              <DarkModeToggle />
            </div>

            {/* MOBILE CONTROLS */}
            <div className="flex items-center gap-2 md:hidden">
              <DarkModeToggle />
              <button
                onClick={() => setIsMenuOpen(true)}
                className="rounded-md p-2 transition
                           hover:bg-accent/10
                           dark:hover:bg-accent/20"
                aria-label="Open menu"
              >
                <Menu />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/70"
            onClick={() => setIsMenuOpen(false)}
          />

          <div
            className="absolute right-0 top-0 h-full w-4/5 max-w-xs
                       bg-bg-surface-light dark:bg-[#1F1F1F]
                       border-l border-border-light dark:border-border-dark
                       p-6"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                Menu
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md p-2 transition
                           hover:bg-accent/10 dark:hover:bg-accent/20"
                aria-label="Close menu"
              >
                <X />
              </button>
            </div>

            {/* Links */}
            <div className="space-y-2 text-sm">
              {showBackButton && (
                <button
                  onClick={() => {
                    navigate(-1);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-md px-3 py-2
                             text-text-muted-light transition
                             hover:bg-accent/10 hover:text-accent
                             dark:text-text-muted-dark dark:hover:bg-accent/20"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}

              <Link
                to="/vehicles"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-md px-3 py-2 transition
                           hover:bg-accent/10 hover:text-accent
                           dark:hover:bg-accent/20"
              >
                Browse Vehicles
              </Link>

              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-md px-3 py-2 transition
                                 hover:bg-accent/10 hover:text-accent
                                 dark:hover:bg-accent/20"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-md px-3 py-2 transition
                                 hover:bg-accent/10 hover:text-accent
                                 dark:hover:bg-accent/20"
                    >
                      My Bookings
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition
                               text-red-600 hover:bg-red-50
                               dark:hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-md px-3 py-2 transition
                               hover:bg-accent/10 hover:text-accent
                               dark:hover:bg-accent/20"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-md px-3 py-2 transition
                               hover:bg-accent/10 hover:text-accent
                               dark:hover:bg-accent/20"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

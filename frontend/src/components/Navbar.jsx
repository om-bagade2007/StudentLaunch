import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-100"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <NavLink to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <img
            src="/studentlaunch-mark.png"
            alt=""
            aria-hidden="true"
            className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200"
          />
          <span className="text-lg font-semibold text-slate-800">StudentLaunch</span>
        </NavLink>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-1">
          <NavLink to="/courses" className={linkClass}>
            Courses
          </NavLink>
          <NavLink to="/tutorials" className={linkClass}>
            Tutorials
          </NavLink>
          <NavLink to="/interview-guidance" className={linkClass}>
            Interview Guidance
          </NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                Profile
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={linkClass}>
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

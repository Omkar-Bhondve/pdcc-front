import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  X,
  Shield,
  FileText,
  Award,
  ClipboardCheck,
  ChevronDown,
  Briefcase,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../common/Button";
import { useAppDispatch } from "../../redux/hooks";
import { logoutUser } from "../../redux/slices/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { PermissionGuard } from "../auth/PermissionGuard";
import { PERMISSIONS } from "../../config/permissions";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", permission: PERMISSIONS.DASHBOARD_VIEW },
  { icon: Shield, label: "Roles & Permissions", path: "/roles", permission: PERMISSIONS.ROLES_VIEW },
  { icon: Users, label: "Users", path: "/users", permission: PERMISSIONS.USERS_VIEW },
  { icon: Briefcase, label: "Work", path: "/work", permission: PERMISSIONS.WORK_VIEW },
  { icon: Users, label: "Contractors", path: "/contractor", permission: PERMISSIONS.CONTRACTOR_VIEW },
];

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { hasPermission } = useAuth();
  const [openSection, setOpenSection] = useState(null);

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  const hasAnyMaster = hasPermission(PERMISSIONS.DEPARTMENTS_VIEW) || hasPermission(PERMISSIONS.DISTRICTS_VIEW);

  const toggleSection = (sectionKey) => {
    setOpenSection((prev) => (prev === sectionKey ? null : sectionKey));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col shadow-xl lg:shadow-none border-r border-slate-800",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800 flex-shrink-0 bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-wide text-slate-100">ADMIN PANEL</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-hide mt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <PermissionGuard 
              key={item.path} 
              permissions={item.permission} 
              fallback={null}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                  )
                }
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0 transition-colors" />
                <span className="relative z-10">{item.label}</span>
              </NavLink>
            </PermissionGuard>
          ))}

          {/* ── Management Section ── */}
          <div className="pt-4 mt-4 border-t border-slate-800/50">
            <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Management
            </div>

            {/* Master Data */}
            <PermissionGuard permissions={[PERMISSIONS.DEPARTMENTS_VIEW, PERMISSIONS.DISTRICTS_VIEW]} fallback={null}>
              <div className="mb-1">
                <button
                  onClick={() => toggleSection("masters")}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                    openSection === "masters" ? "text-slate-200 bg-slate-800/50" : "text-slate-400 hover:bg-slate-800/30 hover:text-slate-200"
                  )}
                >
                  <div className="flex items-center">
                    <LayoutDashboard className="mr-3 h-5 w-5 flex-shrink-0 text-slate-500 group-hover:text-slate-400" />
                    <span>Master Data</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200 text-slate-500",
                      openSection === "masters" ? "rotate-180 text-slate-400" : ""
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "mt-1 space-y-0.5 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
                    openSection === "masters" ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="pl-4 border-l border-slate-800 ml-4 my-1 space-y-1">
                    <PermissionGuard permissions={PERMISSIONS.DEPARTMENTS_VIEW} fallback={null}>
                      <NavLink
                        to="/masters/departments"
                        className={({ isActive }) =>
                          cn(
                            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive
                              ? "text-blue-400 bg-blue-500/10"
                              : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                          )
                        }
                        onClick={() => setOpenSection("masters")}
                      >
                        Departments
                      </NavLink>
                    </PermissionGuard>

                    <PermissionGuard permissions={PERMISSIONS.DISTRICTS_VIEW} fallback={null}>
                      <NavLink
                        to="/masters/districts"
                        className={({ isActive }) =>
                          cn(
                            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive
                              ? "text-blue-400 bg-blue-500/10"
                              : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                          )
                        }
                        onClick={() => setOpenSection("masters")}
                      >
                        Districts
                      </NavLink>
                    </PermissionGuard>
                  </div>
                </div>
              </div>
            </PermissionGuard>
          </div>
        </nav>

        <div className="flex-shrink-0 p-4 border-t border-slate-800 bg-slate-900">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            leftIcon={<LogOut className="h-5 w-5" />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import MobileDrawer from "./MobileDrawer";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <MobileDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} />

      <div className="lg:ml-[240px] min-h-screen">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden h-11 w-11 rounded-lg border border-gray-300"
              onClick={() => setOpenDrawer(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <div>
              <p className="text-sm text-gray-500">Welcome</p>
              <p className="font-semibold text-gray-900">{user?.name}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="h-11 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium"
          >
            Logout
          </button>
        </header>

        <main className="p-4 lg:p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

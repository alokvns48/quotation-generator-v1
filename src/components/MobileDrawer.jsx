import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Quotations", to: "/quotations" },
  { label: "Customers", to: "/customers" },
  { label: "Settings", to: "/settings" },
];

const MobileDrawer = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close sidebar overlay"
      />
      <aside className="relative h-full w-[240px] bg-white p-4 shadow-xl animate-[slideIn_.2s_ease-out]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-lg border border-gray-300 text-xl"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default MobileDrawer;

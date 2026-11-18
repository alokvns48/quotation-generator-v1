import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Quotations", to: "/quotations" },
  { label: "Customers", to: "/customers" },
  { label: "Settings", to: "/settings" },
];

const activeClasses = "bg-blue-600 text-white";
const baseClasses = "px-4 py-3 rounded-lg text-sm font-medium";

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-gray-200 flex-col p-4">
      <h1 className="text-xl font-bold text-gray-900">Quotation Builder</h1>
      <nav className="mt-6 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : "text-gray-700 hover:bg-gray-100"}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { items } = useCart();
  const { isLoggedIn, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl border-b-4 border-blue-600">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-3xl font-black tracking-wider group">
          <span className="text-white">Canvas</span>
          <span className="text-blue-400 group-hover:text-blue-300 transition">Studio</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`
            }
          >
            Головна
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`
            }
          >
            Каталог
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition relative ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`
            }
          >
            🛒 Кошик
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {count}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`
            }
          >
            Контакти
          </NavLink>

          {!isLoading && isLoggedIn && (
            <>
              <div className="w-px h-6 bg-slate-600 mx-2"></div>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                  }`
                }
              >
                🏠 Меню
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition"
              >
                Вихід
              </button>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <NavLink
            to="/cart"
            className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition relative"
          >
            🛒
            {count > 0 && (
              <span className="absolute -top-1 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </NavLink>
          {!isLoading && isLoggedIn && (
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium"
            >
              Вихід
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Art<span className="text-slate-500">Gallery</span>
        </Link>
        <nav className="space-x-4 text-sm">
          <NavLink to="/" className="hover:text-slate-600">
            Головна
          </NavLink>
          <NavLink to="/gallery" className="hover:text-slate-600">
            Каталог
          </NavLink>
          <NavLink to="/cart" className="hover:text-slate-600">
            Кошик ({count})
          </NavLink>
          <NavLink to="/contact" className="hover:text-slate-600">
            Контакти
          </NavLink>
          <NavLink to="/admin/login" className="hover:text-slate-600">
            Адмін
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;

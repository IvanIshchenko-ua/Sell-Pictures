import { Link, Outlet, useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const location = useLocation();
  const isOnSubPage = location.pathname !== "/admin";

  return (
    <section className="mt-6 grid md:grid-cols-[220px,1fr] gap-6">
      <aside className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-lg p-4 space-y-2 text-sm h-fit border border-slate-700">
        <h2 className="font-bold mb-4 text-lg text-white px-2">Адмін-панель</h2>
        <Link
          to="/admin/paintings"
          className="block px-4 py-3 rounded-lg hover:bg-blue-600 hover:text-white text-slate-300 transition font-medium"
        >
          📸 Картини
        </Link>
        <Link
          to="/admin/orders"
          className="block px-4 py-3 rounded-lg hover:bg-purple-600 hover:text-white text-slate-300 transition font-medium"
        >
          📦 Замовлення
        </Link>
        {isOnSubPage && (
          <>
            <hr className="my-3 border-slate-700" />
            <Link
              to="/admin"
              className="block px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition text-center"
            >
              ← Назад до меню
            </Link>
          </>
        )}
      </aside>
      <div className="min-h-96">
        <Outlet />
      </div>
    </section>
  );
};

export default AdminDashboard;

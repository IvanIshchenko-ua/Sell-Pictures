import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <section className="mt-6 grid md:grid-cols-[220px,1fr] gap-6">
      <aside className="bg-white rounded-xl shadow p-4 space-y-3 text-sm">
        <h2 className="font-bold mb-2">Адмін-панель</h2>
        <Link to="/admin/paintings" className="block hover:text-slate-600">
          Картини
        </Link>
        <Link to="/admin/orders" className="block hover:text-slate-600">
          Замовлення
        </Link>
      </aside>
      <div>
        <Outlet />
      </div>
    </section>
  );
};

export default AdminDashboard;

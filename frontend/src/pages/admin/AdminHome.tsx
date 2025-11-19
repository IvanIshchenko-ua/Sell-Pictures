import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <div className="space-y-8">
      {/* Welcome секція */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Ласкаво просимо! 👋</h1>
        <p className="text-lg opacity-90">
          Ви в адміністраторській панелі CanvasStudio. Тут ви можете керувати картинами та замовленнями.
        </p>
      </div>

      {/* Головні розділи */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/admin/paintings">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden group">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-8 h-32 flex items-center justify-center">
              <p className="text-6xl">📸</p>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                Картини
              </h3>
              <p className="text-slate-600 mb-4">
                Керуйте каталогом картин. Додавайте нові роботи, редагуйте описи та видаляйте старі.
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700 transition">
                Перейти → 
              </button>
            </div>
          </div>
        </Link>

        <Link to="/admin/orders">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden group">
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-8 h-32 flex items-center justify-center">
              <p className="text-6xl">📦</p>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition">
                Замовлення
              </h3>
              <p className="text-slate-600 mb-4">
                Переглядайте всі замовлення. Змінюйте статус, видаляйте замовлення та керуйте доставкою.
              </p>
              <button className="text-purple-600 font-semibold hover:text-purple-700 transition">
                Перейти →
              </button>
            </div>
          </div>
        </Link>
      </div>

      {/* Швидкі можливості */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Швидкі можливості</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/admin/paintings">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 hover:border-blue-400 hover:shadow-lg hover:bg-blue-100 transition cursor-pointer group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition">➕</div>
              <h4 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition">Додати картину</h4>
              <p className="text-sm text-slate-600">Завантажте нову роботу до каталогу</p>
            </div>
          </Link>

          <Link to="/admin/paintings">
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 hover:border-purple-400 hover:shadow-lg hover:bg-purple-100 transition cursor-pointer group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition">✏️</div>
              <h4 className="font-semibold text-slate-900 mb-2 group-hover:text-purple-600 transition">Редагувати</h4>
              <p className="text-sm text-slate-600">Змініть інформацію про картину</p>
            </div>
          </Link>

          <Link to="/admin/orders">
            <div className="bg-pink-50 rounded-xl p-6 border border-pink-200 hover:border-pink-400 hover:shadow-lg hover:bg-pink-100 transition cursor-pointer group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition">📊</div>
              <h4 className="font-semibold text-slate-900 mb-2 group-hover:text-pink-600 transition">Відстежувати</h4>
              <p className="text-sm text-slate-600">Спостерігайте за статусом замовлень</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Поради */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">💡 Поради</h2>
        <ul className="space-y-2 text-amber-800">
          <li>✓ Регулярно оновлюйте каталог новими картинами</li>
          <li>✓ Відповідайте на замовлення якнайшвидше</li>
          <li>✓ Змінюйте статус замовлень під час обробки</li>
          <li>✓ Завдяки меню навігуйте між розділами</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminHome;

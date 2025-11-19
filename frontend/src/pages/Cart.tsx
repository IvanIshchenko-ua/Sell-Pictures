import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  if (!items.length) {
    return (
      <section className="py-12">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Кошик порожній</h2>
          <p className="text-lg text-slate-600 mb-6">Поки що ви не добавили жодної картини</p>
          <Link
            to="/gallery"
            className="inline-block px-8 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-md"
          >
            ← Повернутися до каталогу
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">🛒 Ваш кошик</h1>
        <p className="text-lg text-slate-600">
          {items.length} {items.length === 1 ? "картина" : "картин"} на суму {total} ₴
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Список товарів */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.painting.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex gap-4 items-center border border-slate-200 group"
            >
              {/* Інформація */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition">
                  {item.painting.title}
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Категорія: <span className="font-medium text-slate-900">{item.painting.category || "Без категорії"}</span>
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <p className="text-sm text-slate-600">
                    За штуку: <span className="font-bold text-blue-600">{item.painting.price} ₴</span>
                  </p>

                  {/* Кнопки для зміни кількості */}
                  <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.painting.id, item.quantity - 1)}
                      className="px-3 py-1 rounded-md text-slate-700 hover:bg-slate-200 font-bold transition"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 font-bold text-slate-900 min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.painting.id, item.quantity + 1)}
                      className="px-3 py-1 rounded-md text-slate-700 hover:bg-slate-200 font-bold transition"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-lg font-bold text-blue-600">
                    Разом: {item.painting.price * item.quantity} ₴
                  </p>
                </div>
              </div>

              {/* Кнопка видалення */}
              <button
                className="px-4 py-3 rounded-lg bg-red-100 text-red-600 font-bold hover:bg-red-200 hover:scale-110 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                onClick={() => removeFromCart(item.painting.id)}
              >
                🗑️ Видалити
              </button>
            </div>
          ))}
        </div>

        {/* Сумарна інформація та оформлення */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border border-blue-200 sticky top-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Підсумок</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-blue-300">
              <div className="flex justify-between items-center">
                <p className="text-slate-700">Кількість товарів:</p>
                <p className="font-bold text-slate-900">{items.length}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-slate-700">Разом предметів:</p>
                <p className="font-bold text-slate-900">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 mb-6">
              <p className="text-slate-600 mb-1">Загальна сума:</p>
              <p className="text-4xl font-black text-blue-600">{total} ₴</p>
            </div>

            <Link
              to="/checkout"
              className="w-full block text-center px-6 py-4 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-md mb-3"
            >
              ✓ Оформити замовлення
            </Link>

            <Link
              to="/gallery"
              className="w-full block text-center px-6 py-3 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 hover:scale-105 transition-all duration-200"
            >
              ← Продовжити покупки
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;

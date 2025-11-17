import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items, removeFromCart, total } = useCart();

  if (!items.length) {
    return (
      <section className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Кошик</h2>
        <p>Кошик порожній.</p>
      </section>
    );
  }

  return (
    <section className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Кошик</h2>
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div
            key={item.painting.id}
            className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{item.painting.title}</p>
              <p className="text-sm text-slate-600">
                {item.quantity} × {item.painting.price} ₴
              </p>
            </div>
            <button
              className="text-sm text-red-600"
              onClick={() => removeFromCart(item.painting.id)}
            >
              Видалити
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Сума: {total} ₴</p>
        <Link
          to="/checkout"
          className="px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold"
        >
          Оформити замовлення
        </Link>
      </div>
    </section>
  );
};

export default Cart;

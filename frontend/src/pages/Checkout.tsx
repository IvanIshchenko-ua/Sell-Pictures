import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axiosClient";
import type { OrderCreatePayload } from "../types";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!items.length) return;

    const payload: OrderCreatePayload = {
      customer_name: name,
      customer_email: email || undefined,
      customer_phone: phone || undefined,
      customer_comment: comment || undefined,
      total_amount: total,
      items: items.map((i) => ({
        painting_id: i.painting.id, 
        quantity: i.quantity,
        price: i.painting.price
      }))
    };

    try {
      setLoading(true);
      await api.post("/orders", payload);
      clearCart();
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <section className="mt-6">
        <p>Кошик порожній.</p>
      </section>
    );
  }

  return (
    <section className="mt-6 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Оформлення замовлення</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">
        <div>
          <label className="block text-sm mb-1">Ім&apos;я *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Телефон</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Коментар</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <p className="font-semibold">Сума: {total} ₴</p>
        <button
          disabled={loading}
          className="px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Відправлення..." : "Підтвердити замовлення"}
        </button>
      </form>
    </section>
  );
};

export default Checkout;

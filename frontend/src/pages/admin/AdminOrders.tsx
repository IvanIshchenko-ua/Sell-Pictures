import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import type { Order } from "../../types";

type OrderStatus = "pending" | "in_process" | "shipped" | "delivered" | "returned";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders");
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error("Помилка завантаження замовлень:", err);
      setError("Не вдалося завантажити замовлення");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити це замовлення?")) return;

    try {
      await api.delete(`/orders/${id}`);
      setOrders(orders.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Помилка видалення замовлення:", err);
      alert("Не вдалося видалити замовлення");
    }
  };

  const handleStatusChange = async (id: number, newStatus: OrderStatus) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      setOrders(
        orders.map((o) =>
          o.id === id ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Помилка оновлення статусу:", err);
      alert("Не вдалося оновити статус");
    }
  };

  const statusLabels: Record<OrderStatus, string> = {
    pending: "Очікування",
    in_process: "Обробка",
    shipped: "Відправлено",
    delivered: "Доставлено",
    returned: "Повернення",
  };

  const statusEmoji: Record<OrderStatus, string> = {
    pending: "⏳",
    in_process: "🔄",
    shipped: "📦",
    delivered: "✅",
    returned: "↩️",
  };

  const statusColors: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    in_process: "bg-blue-100 text-blue-800 border border-blue-300",
    shipped: "bg-purple-100 text-purple-800 border border-purple-300",
    delivered: "bg-green-100 text-green-800 border border-green-300",
    returned: "bg-red-100 text-red-800 border border-red-300",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">📦 Управління замовленнями</h1>
        <p className="text-slate-600">Відстежуйте замовлення та керуйте статусами доставки</p>
      </div>

      {loading && (
        <div className="bg-blue-50 rounded-2xl p-12 text-center border border-blue-200">
          <p className="text-blue-600 text-lg">⏳ Завантаження замовлень...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 rounded-2xl p-12 text-center border border-red-200">
          <p className="text-red-600 text-lg">❌ {error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-slate-600 text-lg">📭 Замовлень поки немає</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Всього замовлень: {orders.length}</h2>
          </div>

          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition border border-slate-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b border-slate-200">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Замовлення №</p>
                      <p className="text-2xl font-bold text-slate-900">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Клієнт</p>
                      <p className="text-lg font-semibold text-slate-900">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Сума</p>
                      <p className="text-2xl font-bold text-blue-600">{order.total_amount} ₴</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Дата</p>
                      <p className="text-sm text-slate-700 font-medium">
                        {new Date(order.created_at).toLocaleDateString("uk-UA")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Контактна інформація */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {order.customer_phone && (
                      <div className="flex items-start gap-3">
                        <span className="text-lg">📱</span>
                        <div>
                          <p className="text-xs text-slate-500 font-semibold">Телефон</p>
                          <p className="text-slate-900 font-medium">{order.customer_phone}</p>
                        </div>
                      </div>
                    )}
                    {order.customer_email && (
                      <div className="flex items-start gap-3">
                        <span className="text-lg">✉️</span>
                        <div>
                          <p className="text-xs text-slate-500 font-semibold">Email</p>
                          <p className="text-slate-900 font-medium truncate">{order.customer_email}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Коментар */}
                  {order.customer_comment && (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-xs text-slate-500 font-semibold mb-1">💬 Коментар</p>
                      <p className="text-slate-700 italic text-sm">{order.customer_comment}</p>
                    </div>
                  )}

                  {/* Управління статусом */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-3">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Статус замовлення</p>
                    
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${statusColors[order.status]}`}>
                        <span>{statusEmoji[order.status]}</span>
                        {statusLabels[order.status]}
                      </span>
                      
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="px-4 py-2 border border-blue-300 rounded-lg text-sm font-medium text-slate-900 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">{statusLabels.pending}</option>
                        <option value="in_process">{statusLabels.in_process}</option>
                        <option value="shipped">{statusLabels.shipped}</option>
                        <option value="delivered">{statusLabels.delivered}</option>
                        <option value="returned">{statusLabels.returned}</option>
                      </select>
                    </div>
                  </div>

                  {/* Кнопка видалення */}
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="w-full px-4 py-3 rounded-lg bg-red-100 text-red-600 font-bold hover:bg-red-200 transition border border-red-300 flex items-center justify-center gap-2"
                  >
                    🗑️ Видалити замовлення
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

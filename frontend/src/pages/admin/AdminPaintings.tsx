import { type FormEvent, useEffect, useState } from "react";
import api, { getImageUrl } from "../../api/axiosClient";
import type { Painting } from "../../types";

const emptyForm: Omit<Painting, "id"> = {
  title: "",
  description: "",
  price: 0,
  image_url: "",
  category: ""
};

const AdminPaintings = () => {
  const [list, setList] = useState<Painting[]>([]);
  const [form, setForm] = useState<Omit<Painting, "id">>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const load = () => {
    api.get("/paintings").then((res) => setList(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let image_url = form.image_url;

    if (file) {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      image_url = res.data.image_url;
    }

    const payload = { ...form, image_url };

    if (editingId) {
      await api.put(`/paintings/${editingId}`, payload);
    } else {
      await api.post("/paintings", payload);
    }

    setForm(emptyForm);
    setFile(null);
    setEditingId(null);
    load();
  };

  const editPainting = (p: Painting) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
      image_url: p.image_url,
      category: p.category
    });
  };

  const deletePainting = async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цю картину?")) return;
    await api.delete(`/paintings/${id}`);
    load();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">📸 Керування картинами</h1>
        <p className="text-slate-600">Додавайте, редагуйте та видаляйте картини з каталогу</p>
      </div>

      {/* Форма для додавання/редагування */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-slate-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {editingId ? "✏️ Редагувати картину" : "➕ Додати нову картину"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="text-sm px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
            >
              Скасувати редагування
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Назва картини *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введіть назву"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Категорія</label>
            <input
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Наприклад: Портрет, Пейзаж"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Ціна (₴) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: Number(e.target.value) }))
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Зображення</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.image_url && (
              <p className="text-xs text-blue-600 mt-2">✓ Поточне зображення завантажене</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Опис</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
            placeholder="Розкажіть про картину..."
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md"
        >
          {editingId ? "✓ Оновити картину" : "➕ Додати картину"}
        </button>
      </form>

      {/* Список картин */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Каталог ({list.length} {list.length === 1 ? "картина" : "картин"})
        </h2>
        
        {list.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-slate-600 text-lg">Картин поки немає. Додайте першу! 🎨</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group border border-slate-200"
              >
                {p.image_url && (
                  <div className="h-48 bg-slate-200 overflow-hidden">
                    <img
                      src={getImageUrl(p.image_url)}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                )}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-2">{p.title}</h3>
                    {p.category && (
                      <p className="text-xs text-slate-500 mt-1">#{p.category}</p>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{p.price} ₴</p>
                  {p.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">{p.description}</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => editPainting(p)}
                      className="flex-1 px-3 py-2 rounded-lg bg-blue-100 text-blue-600 font-semibold hover:bg-blue-200 transition text-sm"
                    >
                      ✏️ Редагувати
                    </button>
                    <button
                      onClick={() => deletePainting(p.id)}
                      className="flex-1 px-3 py-2 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition text-sm"
                    >
                      🗑️ Видалити
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaintings;

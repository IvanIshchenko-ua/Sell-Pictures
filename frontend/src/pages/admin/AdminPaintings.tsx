import  {type FormEvent, useEffect, useState } from "react";
import api from "../../api/axiosClient";
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
    await api.delete(`/paintings/${id}`);
    load();
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Картини</h3>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow space-y-3 mb-6"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Назва</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Категорія</label>
            <input
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Ціна (₴)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: Number(e.target.value) }))
              }
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Зображення</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
            {form.image_url && (
              <p className="text-xs text-slate-500 mt-1">
                Поточний: {form.image_url}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Опис</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <button className="px-6 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold">
          {editingId ? "Оновити" : "Додати"} картину
        </button>
      </form>

      <div className="bg-white rounded-xl shadow divide-y">
        {list.map((p) => (
          <div
            key={p.id}
            className="p-3 flex justify-between items-center text-sm"
          >
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-slate-500">
                {p.price} ₴ {p.category && `· ${p.category}`}
              </p>
            </div>
            <div className="space-x-3">
              <button
                className="text-blue-600"
                onClick={() => editPainting(p)}
              >
                Редагувати
              </button>
              <button
                className="text-red-600"
                onClick={() => deletePainting(p.id)}
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPaintings;

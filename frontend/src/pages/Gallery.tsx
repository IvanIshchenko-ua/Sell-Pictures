import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import type { Painting } from "../types";
import { PaintingCard } from "../components/PaintingCard";

const Gallery = () => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    api.get("/paintings").then((res) => setPaintings(res.data));
  }, []);

  const categories = Array.from(
    new Set(paintings.map((p) => p.category).filter(Boolean))
  );

  const filtered = paintings.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-12">
      {/* Заголовок */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
          🖼️ Каталог картин
        </h1>
        <p className="text-lg text-slate-600">
          Виберіть улюблену роботу з нашої колекції
        </p>
      </div>

      {/* Фільтри */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-slate-200">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Пошук */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              🔍 Пошук по назві
            </label>
            <input
              type="text"
              placeholder="Введіть назву картини..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Категорії */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                📂 Категорія
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Всі категорії</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Результати */}
      {filtered.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-16 text-center border border-slate-200">
          <p className="text-2xl text-slate-600">
            {paintings.length === 0
              ? "🎨 Картин поки немає"
              : "🔍 Картин не знайдено за вашим пошуком"}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 text-slate-600 font-medium">
            Знайдено: <span className="text-blue-600 font-bold">{filtered.length}</span> картин
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <PaintingCard key={p.id} painting={p} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Gallery;

import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import type { Painting } from "../types";
import { PaintingCard } from "../components/PaintingCard";

const Gallery = () => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/paintings").then((res) => setPaintings(res.data));
  }, []);

  const filtered = paintings.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Каталог картин</h2>
        <input
          type="text"
          placeholder="Пошук за назвою..."
          className="border rounded-full px-4 py-2 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <PaintingCard key={p.id} painting={p} />
        ))}
      </div>
    </section>
  );
};

export default Gallery;

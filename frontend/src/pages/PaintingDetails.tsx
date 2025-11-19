import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { getImageUrl } from "../api/axiosClient";
import type { Painting } from "../types";
import { useCart } from "../context/CartContext";

const PaintingDetails = () => {
  const { id } = useParams();
  const [painting, setPainting] = useState<Painting | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    api.get(`/paintings/${id}`).then((res) => setPainting(res.data));
  }, [id]);

  if (!painting) return <p>Завантаження...</p>;

  return (
    <section className="mt-6 grid md:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {painting.image_url && (
          <img
            src={getImageUrl(painting.image_url)}
            alt={painting.title}
            className="w-full object-cover"
          />
        )}
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-2">{painting.title}</h2>
        {painting.category && (
          <p className="text-sm text-slate-500 mb-2">{painting.category}</p>
        )}
        <p className="text-xl font-semibold mb-4">{painting.price} ₴</p>
        <p className="text-slate-700 mb-6 whitespace-pre-line">
          {painting.description}
        </p>
        <button
          onClick={() => addToCart(painting)}
          className="px-8 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 hover:scale-110 transition-all duration-200 shadow-md"
        >
          ✓ Додати в кошик
        </button>
      </div>
    </section>
  );
};

export default PaintingDetails;

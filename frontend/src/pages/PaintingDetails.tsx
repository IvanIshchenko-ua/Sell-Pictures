import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosClient";
import { Painting } from "../types";
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
            src={`http://localhost:5000${painting.image_url}`}
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
          className="px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold"
        >
          Додати в кошик
        </button>
      </div>
    </section>
  );
};

export default PaintingDetails;

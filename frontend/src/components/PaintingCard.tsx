import { Link } from "react-router-dom";
import type { Painting } from "../types";
import { getImageUrl } from "../api/axiosClient";
import { useCart } from "../context/CartContext";

export const PaintingCard = ({ painting }: { painting: Painting }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden flex flex-col border border-slate-200 group">
      {/* Зображення */}
      <div className="relative h-56 bg-slate-100 overflow-hidden">
        {painting.image_url && (
          <img
            src={getImageUrl(painting.image_url)}
            alt={painting.title}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        )}
        {/* Категорія бейдж */}
        {painting.category && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold opacity-90">
            {painting.category}
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
          {painting.title}
        </h3>

        {/* Ціна */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-blue-600">{painting.price} ₴</p>
        </div>

        {/* Опис */}
        {painting.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {painting.description}
          </p>
        )}

        {/* Кнопки */}
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={() => addToCart(painting)}
            className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-sm"
          >
            ✓ Додати в кошик
          </button>
          <Link
            to={`/painting/${painting.id}`}
            className="w-full px-4 py-2 rounded-lg text-center bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 hover:text-slate-900 hover:scale-105 transition-all duration-200"
          >
            Детальніше →
          </Link>
        </div>
      </div>
    </div>
  );
};

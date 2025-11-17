import { Link } from "react-router-dom";
import type { Painting } from "../types";

export const PaintingCard = ({ painting }: { painting: Painting }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {painting.image_url && (
        <img
          src={`http://localhost:5000${painting.image_url}`}
          alt={painting.title}
          className="h-56 w-full object-cover"
        />
      )}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-1">{painting.title}</h3>
        {painting.category && (
          <p className="text-xs text-slate-500 mb-2">{painting.category}</p>
        )}
        <p className="text-slate-900 font-bold mb-3">{painting.price} ₴</p>
        <Link
          to={`/painting/${painting.id}`}
          className="mt-auto text-sm font-semibold text-slate-700 hover:underline"
        >
          Детальніше →
        </Link>
      </div>
    </div>
  );
};

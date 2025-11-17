import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center mt-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Сучасна галерея{" "}
          <span className="text-slate-500">авторських картин</span>
        </h1>
        <p className="text-lg text-slate-700 mb-6">
          Унікальні роботи для дому, офісу та подарунків.
        </p>
        <div className="space-x-4">
          <Link
            to="/gallery"
            className="inline-block px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold"
          >
            Перейти до каталогу
          </Link>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 rounded-full border border-slate-400 text-sm font-semibold"
          >
            Зв&apos;язатися
          </Link>
        </div>
      </div>
      <div className="bg-slate-200 rounded-3xl h-72 md:h-96 shadow-inner flex items-center justify-center">
        <span className="text-slate-500 text-sm">
          Тут пізніше можна зробити слайдер із найкращими картинами
        </span>
      </div>
    </section>
  );
};

export default Home;

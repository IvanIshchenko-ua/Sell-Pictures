import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t-4 border-blue-600 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Основна секція */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Про сайт */}
          <div>
            <h3 className="text-2xl font-black text-white mb-4">
              <span>Canvas</span>
              <span className="text-blue-400">Studio</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Студія мистецтва, де кожна картина — витвір творчості та натхнення.
            </p>
          </div>

          {/* Навігація */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Навігація</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-blue-400 transition">
                  Головна
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-400 hover:text-blue-400 transition">
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-slate-400 hover:text-blue-400 transition">
                  Кошик
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-blue-400 transition">
                  Контакти
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакти */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Контакти</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+380XXXXXXXXX" className="text-slate-400 hover:text-blue-400 transition">
                  📞 +380 XX XXX XX XX
                </a>
              </li>
              <li>
                <a href="https://instagram.com/your_art_page" className="text-slate-400 hover:text-blue-400 transition">
                  📸 Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Соціальні мережі */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Слідкуйте за нами</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition"
              >
                📸
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition"
              >
                f
              </a>
            </div>
          </div>
        </div>

        {/* Розділювач */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Низькі символи */}
        <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p>© {currentYear} CanvasStudio. Всі права захищені.</p>
            <span className="hidden md:inline">•</span>
            <p className="text-slate-500">
              Made with 💙 by <span className="font-bold text-blue-400">Ivan Ishchenko</span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-blue-400 transition">
              Приватність
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              Умови користування
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

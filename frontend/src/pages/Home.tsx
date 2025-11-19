import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero секція */}
      <section className="mt-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                <span className="text-blue-600">Canvas</span>Studio
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-600 mb-4">
                Студія мистецтва та творчості
              </h2>
            </div>
            <p className="text-lg text-slate-700 leading-relaxed">
              Унікальні роботи для дому, офісу та подарунків. Кожна картина — це витвір мистецтва, 
              який внесе красу та гармонію в ваш простір.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/gallery"
                className="inline-block px-8 py-4 rounded-full bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
              >
                Переглянути каталог →
              </Link>
              <Link
                to="/contact"
                className="inline-block px-8 py-4 rounded-full border-2 border-blue-600 text-blue-600 text-base font-semibold hover:bg-blue-50 transition"
              >
                Зв'язатися з нами
              </Link>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl h-80 md:h-96 shadow-2xl flex items-center justify-center border-2 border-blue-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-slate-600 text-sm font-medium">
                Галерея передусім картин
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Переваги */}
      <section className="bg-slate-50 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Чому обрати нас?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">Унікальність</h3>
            <p className="text-slate-600">
              Кожна картина — авторський витвір, якого більше не буде. Гарантована оригінальність!
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">Якість</h3>
            <p className="text-slate-600">
              Матеріали вищої якості та професійне виконання. Картини прослужать довгі роки.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">Доставка</h3>
            <p className="text-slate-600">
              Надійна доставка в будь-який куточок. Гарантія сохранності вашого замовлення.
            </p>
          </div>
        </div>
      </section>

      {/* Відгуки/Про нас */}
      <section className="text-center space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Артгалерея для вас</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ми збираємо кращі роботи талановитих художників та пропонуємо їх вам. 
            Наша мета — принести красу і натхнення в кожен дім.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 pt-4">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <p className="text-slate-700 font-medium">Картин в каталозі</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
            <p className="text-slate-700 font-medium">Оригінальні роботи</p>
          </div>
          <div className="bg-pink-50 rounded-2xl p-6 border border-pink-200">
            <div className="text-3xl font-bold text-pink-600 mb-2">⭐⭐⭐⭐⭐</div>
            <p className="text-slate-700 font-medium">Рейтинг клієнтів</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Готові знайти ідеальну картину?</h2>
        <p className="text-lg mb-8 opacity-90">
          Переглядайте наш каталог і вибирайте найкращі роботи
        </p>
        <Link
          to="/gallery"
          className="inline-block px-8 py-4 rounded-full bg-white text-blue-600 font-bold hover:bg-slate-100 transition shadow-lg"
        >
          Перейти до галереї
        </Link>
      </section>
    </div>
  );
};

export default Home;

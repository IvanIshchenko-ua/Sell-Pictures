const Contact = () => {
  return (
    <section className="mt-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Контакти</h1>
        <p className="text-slate-600 text-lg">Зв'яжіться з нами будь-яким зручним способом</p>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
        {/* Телефон */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md p-6 text-center border border-blue-200 w-full md:w-64">
          <div className="text-4xl mb-4">📞</div>
          <h3 className="font-semibold text-lg mb-2 text-slate-900">Телефон</h3>
          <p className="text-slate-700 font-medium mb-3">+380 68 106 06 03</p>
          <a
            href="tel:+380681060603"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Подзвонити
          </a>
        </div>

        {/* Instagram */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl shadow-md p-6 text-center border border-pink-200 w-full md:w-64">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="font-semibold text-lg mb-2 text-slate-900">Instagram</h3>
          <p className="text-slate-700 font-medium mb-3">@your_art_page</p>
          <a
            href="https://instagram.com/your_art_page"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition"
          >
            Відвідати
          </a>
        </div>
      </div>

      {/* Додаткова інформація */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Години роботи</h2>
        <div className="text-center">
          <p className="text-slate-600 mb-2"><span className="font-semibold text-slate-900">Пн-Пт:</span> 09:00 - 18:00</p>
          <p className="text-slate-600 mb-2"><span className="font-semibold text-slate-900">Сб:</span> 10:00 - 16:00</p>
          <p className="text-slate-600 mb-4"><span className="font-semibold text-slate-900">Нд:</span> Вихідний</p>
          <p className="text-slate-700 leading-relaxed">
            Ми раді допомогти вам з будь-якими запитаннями щодо наших картин та послуг. 
            Зв'яжіться з нами в найзручніший для вас спосіб! 🎨
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;

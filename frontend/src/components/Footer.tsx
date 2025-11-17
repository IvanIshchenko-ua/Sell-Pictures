const Footer = () => (
  <footer className="bg-slate-900 text-slate-200 mt-8">
    <div className="container mx-auto px-4 py-6 flex justify-between items-center text-sm">
      <p>© {new Date().getFullYear()} ArtGallery</p>
      <div className="space-x-3">
        <a href="#" className="hover:underline">
          Instagram
        </a>
        <a href="mailto:example@mail.com" className="hover:underline">
          Email
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;

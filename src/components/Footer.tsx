const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0C10] border-t border-white/5 py-8">
      <div className="px-6 lg:px-[7vw]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="opacity-70">
            <img
              src="/logo.png"
              alt="Prolife Logistics"
              className="h-6 w-auto"
            />
          </div>

          {/* Copyright */}
          <p className="text-sm text-[#A9B1BA] text-center">
            © {currentYear} Prolife Logistics. Все права защищены.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://prolife.kg/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#A9B1BA] hover:text-[#F4F6F8] transition-colors"
            >
              Оригинальный сайт
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

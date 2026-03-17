import { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Расчёт', id: 'hero' },
    { label: 'Как это работает', id: 'how-it-works' },
    { label: 'Услуги', id: 'services' },
    { label: 'Отзывы', id: 'testimonials' },
    { label: 'Контакты', id: 'contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0B0C10]/90 backdrop-blur-md border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-6 lg:px-[7vw]">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="font-mono text-sm tracking-[0.2em] text-[#F4F6F8] hover:text-[#4A90A4] transition-colors"
            >
              PROLIFE
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-[#A9B1BA] hover:text-[#F4F6F8] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="https://api.whatsapp.com/send?phone=996990111125&text="
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-sm py-2.5 px-4"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#F4F6F8]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[99] bg-[#0B0C10]/98 backdrop-blur-lg transition-all duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-2xl font-display text-[#F4F6F8] hover:text-[#4A90A4] transition-colors"
            >
              {item.label}
            </button>
          ))}
          <a
            href="https://api.whatsapp.com/send?phone=996990111125&text="
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Написать в WhatsApp
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;

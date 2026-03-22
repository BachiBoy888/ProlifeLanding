import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

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
    setIsMobileMenuOpen(false);
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
              className="shrink-0 opacity-90 hover:opacity-100 transition-opacity"
              aria-label="Prolife — на главную"
            >
              <img
                src="/logo.png"
                alt="Prolife Logistics"
                className="h-7 lg:h-8 w-auto"
              />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-[#A9B1BA] hover:text-[#F4F6F8] transition-colors"
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <motion.a
                href={`https://api.whatsapp.com/send?phone=996990111125&text=${encodeURIComponent('Здравствуйте, интересует доставка из Китая')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-sm py-2.5 px-4"
                onClick={() => trackEvent('whatsapp_opened', { source: 'header' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#F4F6F8]"
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[99] bg-[#0B0C10]/98 backdrop-blur-lg lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-2xl font-display text-[#F4F6F8] hover:text-[#4A90A4] transition-colors"
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.a
                href={`https://api.whatsapp.com/send?phone=996990111125&text=${encodeURIComponent('Здравствуйте, интересует доставка из Китая')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4"
                onClick={() => trackEvent('whatsapp_opened', { source: 'header' })}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Написать в WhatsApp
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

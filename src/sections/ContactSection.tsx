import { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Phone, MapPin, Clock, Mail, Calendar, Shield, User, Send, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { x: '-6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        panelRef.current,
        { x: '6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: panelRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleCallback = () => {
    if (!phone.trim()) {
      setPhoneError('Введите номер телефона');
      return;
    }
    setPhoneError('');
    const parts = [
      'Здравствуйте! Прошу перезвонить.',
      name.trim() ? `Имя: ${name.trim()}` : null,
      `Номер: ${phone.trim()}`,
    ].filter(Boolean);
    const text = encodeURIComponent(parts.join('\n'));
    window.open(`https://api.whatsapp.com/send?phone=996990111125&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-[#0B0C10] py-20 lg:py-32"
    >
      <div className="px-6 lg:px-[7vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left content */}
          <div ref={contentRef}>
            <h2 className="font-display text-3xl lg:text-5xl font-bold text-[#F4F6F8] mb-4">
              Начните с расчёта стоимости
            </h2>
            <p className="text-[#A9B1BA] text-lg mb-8">
              Ответим за 10–15 минут. Без скрытых платежей.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.a
                href={`https://api.whatsapp.com/send?phone=996990111125&text=${encodeURIComponent('Здравствуйте, хочу получить консультацию по доставке')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Написать в WhatsApp
              </motion.a>
              <motion.a
                href="tel:+996990111125"
                className="btn-outline"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
              >
                <Phone className="w-5 h-5 mr-2" />
                +996 990 11 11 25
              </motion.a>
            </div>

            {/* Callback form */}
            <div className="panel-glass rounded-lg p-5 mb-8">
              <p className="font-display font-semibold text-[#F4F6F8] mb-4">Перезвоните мне</p>
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6070]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя (необязательно)"
                    className="input-field text-sm pl-10"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a6070]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setPhoneError(''); }}
                    placeholder="+996 ___ __ __ __"
                    className="input-field text-sm pl-10"
                  />
                </div>
                <AnimatePresence>
                  {phoneError && (
                    <motion.p
                      className="text-xs text-red-400"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {phoneError}
                    </motion.p>
                  )}
                </AnimatePresence>
                <motion.button
                  onClick={handleCallback}
                  className="btn-primary w-full text-sm"
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Отправить заявку
                </motion.button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-[#A9B1BA]">
                <Calendar className="w-4 h-4 text-[#4A90A4]" />
                <span>С 2015 года</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#A9B1BA]">
                <Shield className="w-4 h-4 text-[#4A90A4]" />
                <span>Страхование включено</span>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div ref={panelRef} className="panel-glass rounded-lg p-6 lg:p-8">
            <h3 className="font-display text-xl font-semibold text-[#F4F6F8] mb-6">
              Контакты
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-[#4A90A4]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#4A90A4]" />
                </div>
                <div>
                  <p className="text-sm text-[#A9B1BA] mb-1">Офис</p>
                  <p className="text-[#F4F6F8]">Бишкек, Льва Толстого 36к/1</p>
                  <p className="text-sm text-[#A9B1BA]">Бизнес центр Monolit</p>
                  <a
                    href="https://go.2gis.com/m7vbhd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#4A90A4] hover:text-[#F4F6F8] transition-colors mt-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Открыть на 2GIS
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-[#4A90A4]/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#4A90A4]" />
                </div>
                <div>
                  <p className="text-sm text-[#A9B1BA] mb-1">Режим работы</p>
                  <p className="text-[#F4F6F8]">Пн–Пт 09:00–18:00</p>
                  <p className="text-sm text-[#A9B1BA]">WhatsApp — 24/7</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-[#4A90A4]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#4A90A4]" />
                </div>
                <div>
                  <p className="text-sm text-[#A9B1BA] mb-1">Email</p>
                  <a
                    href="mailto:office@prolife.kg"
                    className="text-[#F4F6F8] hover:text-[#4A90A4] transition-colors"
                  >
                    office@prolife.kg
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-[#4A90A4]/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#4A90A4]" />
                </div>
                <div>
                  <p className="text-sm text-[#A9B1BA] mb-1">Телефон</p>
                  <a
                    href="tel:+996990111125"
                    className="text-[#F4F6F8] hover:text-[#4A90A4] transition-colors"
                  >
                    +996 990 11 11 25
                  </a>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-sm text-[#A9B1BA] mb-4">Мы в соцсетях</p>
              <div className="flex gap-3">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/prolife.kg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-md bg-[#0B0C10] flex items-center justify-center text-[#A9B1BA] hover:text-[#4A90A4] hover:bg-[#4A90A4]/10 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* Telegram */}
                <a
                  href="https://t.me/Prolifekg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-md bg-[#0B0C10] flex items-center justify-center text-[#A9B1BA] hover:text-[#4A90A4] hover:bg-[#4A90A4]/10 transition-colors"
                  aria-label="Telegram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/prolife.bishkek"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-md bg-[#0B0C10] flex items-center justify-center text-[#A9B1BA] hover:text-[#4A90A4] hover:bg-[#4A90A4]/10 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="https://www.youtube.com/channel/KiIfYe8uzM4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-md bg-[#0B0C10] flex items-center justify-center text-[#A9B1BA] hover:text-[#4A90A4] hover:bg-[#4A90A4]/10 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

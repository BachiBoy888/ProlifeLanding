import { motion } from 'motion/react';
import { ArrowDown, Package, Shield, Clock, Star } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

interface LabHeroProps {
  onCalcClick: () => void;
}

const LabHero = ({ onCalcClick }: LabHeroProps) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-16">
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[15%] left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(74,144,164,0.12) 0%, transparent 70%)' }}
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(74,144,164,0.08) 0%, transparent 70%)' }}
          animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-[#4A90A4]/30 bg-[#4A90A4]/8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
          <span className="font-mono text-xs text-[#4A90A4] tracking-wider">
            БЛИЖАЙШИЙ РЕЙС — 24 МАРТА
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-bold text-[#F4F6F8] leading-[0.88] mb-6"
          style={{ fontSize: 'clamp(52px, 10vw, 140px)' }}
        >
          ДОСТАВКА
          <br />
          <span
            className="text-[#4A90A4]"
            style={{ textShadow: '0 0 60px rgba(74,144,164,0.45), 0 0 120px rgba(74,144,164,0.2)' }}
          >
            ИЗ КИТАЯ
          </span>
          <br />
          ЗА 12 ДНЕЙ
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="font-mono text-[#A9B1BA] text-xs tracking-widest mb-8"
        >
          В БИШКЕК · ТАМОЖНЯ ВКЛЮЧЕНА · ЛИЧНЫЙ МЕНЕДЖЕР 24/7
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.button
            onClick={() => {
              onCalcClick();
              trackEvent('cta_clicked', { location: 'lab_hero_calc' });
            }}
            className="px-8 py-4 rounded-xl font-display font-semibold text-[#050608] bg-[#4A90A4] text-base w-full sm:w-auto"
            style={{ boxShadow: '0 0 40px rgba(74,144,164,0.5), 0 0 80px rgba(74,144,164,0.18)' }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 60px rgba(74,144,164,0.65), 0 0 100px rgba(74,144,164,0.25)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            Рассчитать стоимость
          </motion.button>
          <motion.a
            href={`https://api.whatsapp.com/send?phone=996990111125&text=${encodeURIComponent('Здравствуйте, хочу узнать о доставке из Китая')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { trackEvent('whatsapp_opened', { source: 'lab_hero' }); trackEvent('cta_clicked', { location: 'lab_hero_whatsapp' }); }}
            className="px-8 py-4 rounded-xl font-display font-semibold text-[#F4F6F8] text-base border border-white/15 bg-white/[0.04] w-full sm:w-auto text-center"
            whileHover={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.07)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            Написать в WhatsApp
          </motion.a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-5"
        >
          {[
            { icon: Package, text: '5 000+ доставок' },
            { icon: Shield, text: '98% без потерь' },
            { icon: Clock, text: 'С 2015 года' },
            { icon: Star, text: '4.9 / 5 рейтинг' },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1.5 text-xs text-[#A9B1BA]">
              <Icon className="w-3.5 h-3.5 text-[#4A90A4] shrink-0" />
              {text}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] text-[#A9B1BA]/40 tracking-widest">SCROLL</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4 text-[#A9B1BA]/30" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LabHero;

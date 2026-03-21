import { motion } from 'motion/react';
import { MessageCircle, ArrowRight } from 'lucide-react';

const LabFinalCTA = () => {
  const waUrl = `https://api.whatsapp.com/send?phone=996990111125&text=${encodeURIComponent('Здравствуйте, хочу оформить доставку из Китая')}`;

  return (
    <section className="relative px-6 py-20 lg:py-32 overflow-hidden">
      {/* Glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(74,144,164,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-[10px] text-[#4A90A4] tracking-widest mb-6">НАЧАТЬ ЛЕГКО</p>
          <h2
            className="font-display font-bold text-[#F4F6F8] leading-[0.88] mb-6"
            style={{ fontSize: 'clamp(44px, 8vw, 100px)' }}
          >
            ГОТОВЫ<br />
            <span
              className="text-[#4A90A4]"
              style={{ textShadow: '0 0 60px rgba(74,144,164,0.4)' }}
            >
              ПРИВЕЗТИ?
            </span>
          </h2>
          <p className="text-[#A9B1BA] text-base lg:text-lg mb-10 leading-relaxed max-w-md mx-auto">
            Напишите нам — менеджер ответит за 15 минут и рассчитает точную стоимость для вашего груза.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 rounded-xl font-display font-semibold text-[#050608] bg-[#4A90A4] text-base w-full sm:w-auto justify-center"
              style={{ boxShadow: '0 0 50px rgba(74,144,164,0.5), 0 0 100px rgba(74,144,164,0.2)' }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 70px rgba(74,144,164,0.65), 0 0 120px rgba(74,144,164,0.3)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              Написать в WhatsApp
            </motion.a>
            <motion.a
              href="#calculator"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-display font-semibold text-[#F4F6F8] text-base border border-white/15 bg-white/[0.04] w-full sm:w-auto justify-center"
              whileHover={{ borderColor: 'rgba(74,144,164,0.4)', backgroundColor: 'rgba(74,144,164,0.05)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              Рассчитать стоимость
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>

          <p className="font-mono text-xs text-[#A9B1BA]/50 mt-8">
            Без предоплаты · Ответим за 15 минут · Работаем с 2015 года
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LabFinalCTA;

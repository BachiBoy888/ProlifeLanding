import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Package, Shield, Clock, MapPin, Zap, Star } from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sub?: string;
  large?: boolean;
  accent?: boolean;
  delay?: number;
}

const useCounter = (target: number, duration = 1400, active = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // ease out
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return count;
};

const StatCard = ({ icon: Icon, value, suffix, prefix = '', label, sub, large, accent, delay = 0 }: StatCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const count = useCounter(value, 1200, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay }}
      className={`rounded-2xl border p-6 flex flex-col justify-between ${
        accent
          ? 'border-[#4A90A4]/30 bg-[#4A90A4]/8'
          : 'border-white/[0.08] bg-white/[0.02]'
      }`}
      style={accent ? { boxShadow: '0 0 40px rgba(74,144,164,0.08)' } : {}}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${accent ? 'bg-[#4A90A4]/20' : 'bg-white/[0.05]'}`}>
        <Icon className={`w-5 h-5 ${accent ? 'text-[#4A90A4]' : 'text-[#A9B1BA]'}`} />
      </div>
      <div>
        <p
          className={`font-display font-bold leading-none mb-1 ${accent ? 'text-[#4A90A4]' : 'text-[#F4F6F8]'}`}
          style={{
            fontSize: large ? 'clamp(40px, 6vw, 64px)' : 'clamp(32px, 4vw, 48px)',
            textShadow: accent ? '0 0 30px rgba(74,144,164,0.3)' : 'none',
          }}
        >
          {prefix}{count.toLocaleString('ru')}{suffix}
        </p>
        <p className="font-display font-semibold text-[#F4F6F8] text-sm mb-1">{label}</p>
        {sub && <p className="font-mono text-[10px] text-[#A9B1BA]">{sub}</p>}
      </div>
    </motion.div>
  );
};

const LabProof = () => {
  return (
    <section className="relative px-6 py-16 lg:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-[10px] text-[#4A90A4] tracking-widest mb-3">ЦИФРЫ</p>
          <h2
            className="font-display font-bold text-[#F4F6F8] leading-[0.9]"
            style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
          >
            ДОВЕРЯЮТ<br />
            <span className="text-[#4A90A4]">ТЫСЯЧИ</span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Large accent card */}
          <div className="col-span-2 lg:col-span-1">
            <StatCard
              icon={Package}
              value={5000}
              suffix="+"
              label="Доставок выполнено"
              sub="с 2015 года"
              large
              accent
              delay={0}
            />
          </div>

          <StatCard
            icon={Shield}
            value={98}
            suffix="%"
            label="Без потерь и порчи"
            sub="страховка включена"
            delay={0.05}
          />

          <StatCard
            icon={Clock}
            value={12}
            suffix=" дней"
            label="Минимальный срок"
            sub="стандартный маршрут"
            delay={0.1}
          />

          <StatCard
            icon={MapPin}
            value={5}
            suffix=" городов"
            label="Забор груза в Китае"
            sub="Гуанчжоу, Иу, Шэньчжэнь..."
            delay={0.15}
          />

          <StatCard
            icon={Zap}
            value={15}
            suffix=" мин"
            label="Время ответа"
            sub="менеджер 24/7"
            delay={0.2}
          />

          {/* Wide card at the bottom */}
          <div className="col-span-2 lg:col-span-1">
            <StatCard
              icon={Star}
              value={9}
              suffix=" лет"
              label="На рынке доставки"
              sub="опыт и репутация"
              delay={0.25}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LabProof;

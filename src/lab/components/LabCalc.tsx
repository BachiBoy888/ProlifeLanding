import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Check, Zap } from 'lucide-react';
import { trackEvent, getUtmParams } from '../../lib/analytics';

const MIN_PRICE = 150;

const WEIGHT_RANGES = [
  { id: 'xs', label: 'до 50 кг', desc: 'посылка', low: 1, high: 50, mid: 25 },
  { id: 'sm', label: '50–200 кг', desc: 'небольшая партия', low: 50, high: 200, mid: 125 },
  { id: 'md', label: '200–500 кг', desc: 'партия товара', low: 200, high: 500, mid: 350 },
  { id: 'lg', label: '500+ кг', desc: 'крупный груз', low: 500, high: 1000, mid: 700 },
] as const;

const CITIES = [
  { id: 'Гуанчжоу', surcharge: 0 },
  { id: 'Иу', surcharge: 30 },
  { id: 'Шэньчжэнь', surcharge: 15 },
  { id: 'Фошань', surcharge: 0 },
  { id: 'Дунгуань', surcharge: 0 },
];

const PACKAGES = [
  { id: 'economy', name: 'Эконом', days: '14–18 дней', rateKg: 0.55, features: ['Автодоставка', 'Трекинг'] },
  { id: 'standard', name: 'Стандарт', days: '12–15 дней', rateKg: 0.70, features: ['Авто + ж/д', 'Страховка', 'Трекинг'], popular: true },
  { id: 'premium', name: 'Премиум', days: '10–12 дней', rateKg: 0.90, features: ['Приоритетный', 'Растаможка', 'Менеджер 24/7'] },
] as const;

type WeightId = typeof WEIGHT_RANGES[number]['id'];
type PackageId = typeof PACKAGES[number]['id'];

const calcPrice = (weightMid: number, surcharge: number, rateKg: number) =>
  Math.max(Math.round(weightMid * rateKg + surcharge), MIN_PRICE);

const LabCalc = () => {
  const [weight, setWeight] = useState<WeightId>('sm');
  const [city, setCity] = useState('Гуанчжоу');
  const [pkg, setPkg] = useState<PackageId>('standard');

  const selectedWeight = WEIGHT_RANGES.find((w) => w.id === weight)!;
  const selectedCity = CITIES.find((c) => c.id === city)!;
  const selectedPkg = PACKAGES.find((p) => p.id === pkg)!;

  const price = calcPrice(selectedWeight.mid, selectedCity.surcharge, selectedPkg.rateKg);

  const waText = encodeURIComponent(
    `Здравствуйте! Хочу рассчитать доставку.\n` +
    `Вес: ${selectedWeight.label}\n` +
    `Город отправки: ${city}\n` +
    `Пакет: ${selectedPkg.name} (${selectedPkg.days})\n` +
    `Ориентировочная стоимость: ~$${price}`
  );
  const waUrl = `https://api.whatsapp.com/send?phone=996990111125&text=${waText}`;

  return (
    <section id="calculator" className="relative px-6 py-16 lg:py-24">
      {/* Section accent line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 lg:h-24"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(74,144,164,0.4), transparent)' }}
      />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-[10px] text-[#4A90A4] tracking-widest mb-3">МГНОВЕННЫЙ РАСЧЁТ</p>
          <h2
            className="font-display font-bold text-[#F4F6F8] leading-[0.9]"
            style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
          >
            СКОЛЬКО СТОИТ<br />
            <span className="text-[#4A90A4]">ВАШ ГРУЗ?</span>
          </h2>
        </motion.div>

        {/* Calculator card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-white/[0.1] overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}
        >
          <div className="p-6 lg:p-8 space-y-8">

            {/* Weight */}
            <div>
              <p className="font-mono text-[10px] text-[#A9B1BA] tracking-widest mb-4">01 — ВЕС ГРУЗА</p>
              <div className="grid grid-cols-2 gap-2">
                {WEIGHT_RANGES.map((w) => (
                  <motion.button
                    key={w.id}
                    onClick={() => setWeight(w.id)}
                    className={`relative rounded-xl px-4 py-3 text-left transition-all duration-200 border ${
                      weight === w.id
                        ? 'border-[#4A90A4] bg-[#4A90A4]/10'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
                    }`}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.1 }}
                  >
                    {weight === w.id && (
                      <motion.div
                        layoutId="weight-indicator"
                        className="absolute inset-0 rounded-xl border border-[#4A90A4]/50"
                        style={{ boxShadow: '0 0 20px rgba(74,144,164,0.15)' }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <p className="font-display font-semibold text-[#F4F6F8] text-sm relative z-10">{w.label}</p>
                    <p className="font-mono text-[10px] text-[#A9B1BA] relative z-10 mt-0.5">{w.desc}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <p className="font-mono text-[10px] text-[#A9B1BA] tracking-widest mb-4">02 — ГОРОД ОТПРАВКИ</p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((c) => (
                  <motion.button
                    key={c.id}
                    onClick={() => setCity(c.id)}
                    className={`px-4 py-2 rounded-lg font-mono text-xs transition-all duration-200 border ${
                      city === c.id
                        ? 'border-[#4A90A4] bg-[#4A90A4]/10 text-[#4A90A4]'
                        : 'border-white/[0.08] bg-white/[0.02] text-[#A9B1BA] hover:border-white/20 hover:text-[#F4F6F8]'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    {c.id}
                    {c.surcharge > 0 && (
                      <span className="ml-1 text-[9px] opacity-60">+${c.surcharge}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Package */}
            <div>
              <p className="font-mono text-[10px] text-[#A9B1BA] tracking-widest mb-4">03 — ТИП ДОСТАВКИ</p>
              <div className="flex flex-col gap-2">
                {PACKAGES.map((p) => (
                  <motion.button
                    key={p.id}
                    onClick={() => setPkg(p.id)}
                    className={`relative rounded-xl px-4 py-3.5 text-left transition-all duration-200 border ${
                      pkg === p.id
                        ? 'border-[#4A90A4] bg-[#4A90A4]/8'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
                    }`}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    {'popular' in p && (
                      <span className="absolute top-3 right-3 font-mono text-[9px] bg-[#4A90A4]/20 text-[#4A90A4] px-2 py-0.5 rounded-full">
                        ПОПУЛЯРНЫЙ
                      </span>
                    )}
                    <div className="flex items-center gap-3 pr-20">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          pkg === p.id ? 'border-[#4A90A4] bg-[#4A90A4]' : 'border-white/20'
                        }`}
                      >
                        {pkg === p.id && <div className="w-1.5 h-1.5 rounded-full bg-[#050608]" />}
                      </div>
                      <div>
                        <span className="font-display font-semibold text-[#F4F6F8] text-sm">{p.name}</span>
                        <span className="font-mono text-[10px] text-[#A9B1BA] ml-2">{p.days}</span>
                      </div>
                    </div>
                    {pkg === p.id && (
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 pl-7">
                        {p.features.map((f) => (
                          <span key={f} className="flex items-center gap-1 text-[11px] text-[#A9B1BA]">
                            <Check className="w-3 h-3 text-[#4A90A4] shrink-0" />
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price result */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{ background: 'linear-gradient(135deg, rgba(74,144,164,0.08) 0%, rgba(74,144,164,0.03) 100%)', border: '1px solid rgba(74,144,164,0.2)' }}
            >
              <p className="font-mono text-[10px] text-[#A9B1BA] tracking-widest mb-2">ОРИЕНТИРОВОЧНАЯ СТОИМОСТЬ</p>
              <div className="flex items-center justify-center gap-2 mb-1 overflow-hidden h-16">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={price}
                    className="font-display font-bold text-[#4A90A4]"
                    style={{
                      fontSize: 'clamp(52px, 8vw, 80px)',
                      lineHeight: 1,
                      textShadow: '0 0 40px rgba(74,144,164,0.4)',
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ~${price}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="font-mono text-[11px] text-[#A9B1BA]">
                {selectedPkg.name} · {selectedPkg.days} · {city}
              </p>
              <p className="font-mono text-[10px] text-[#A9B1BA]/50 mt-1">
                * предварительный расчёт, таможня включена
              </p>
            </div>

            {/* CTA */}
            <motion.a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent('calculator_completed', {
                  package: pkg,
                  city,
                  weight_range: weight,
                  estimated_price: price,
                });
                trackEvent('lead_submitted', { source: 'lab_calculator', ...getUtmParams() });
              }}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-display font-semibold text-[#050608] bg-[#4A90A4] text-base"
              style={{ boxShadow: '0 0 40px rgba(74,144,164,0.45), 0 0 80px rgba(74,144,164,0.15)' }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 60px rgba(74,144,164,0.6), 0 0 100px rgba(74,144,164,0.22)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              Получить точный расчёт в WhatsApp
            </motion.a>

            <div className="flex items-center justify-center gap-6">
              <span className="flex items-center gap-1.5 text-[11px] text-[#A9B1BA]">
                <Zap className="w-3 h-3 text-[#4A90A4]" />
                Ответ за 15 минут
              </span>
              <span className="font-mono text-[11px] text-[#A9B1BA]">·</span>
              <span className="font-mono text-[11px] text-[#A9B1BA]">Без предоплаты</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LabCalc;

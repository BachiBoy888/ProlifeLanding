import { motion } from 'motion/react';

const STEPS = [
  {
    num: '01',
    title: 'Заявка за 2 минуты',
    desc: 'Напишите в WhatsApp или оставьте контакт. Менеджер свяжется в течение 15 минут.',
  },
  {
    num: '02',
    title: 'Забор груза в Китае',
    desc: 'Заберём товар прямо с фабрики или рынка. Проверим комплектацию и сделаем фотоотчёт.',
  },
  {
    num: '03',
    title: 'Таможня и логистика',
    desc: 'Берём на себя все таможенные процедуры и документы. Без вашего участия.',
  },
  {
    num: '04',
    title: 'Доставка в Бишкек',
    desc: 'Груз прибывает на склад в Бишкеке. Уведомим вас и организуем выдачу удобным способом.',
  },
];

const LabSteps = () => {
  return (
    <section className="relative px-6 py-16 lg:py-24">
      {/* Vertical accent line (desktop) */}
      <div
        className="hidden lg:block absolute left-1/2 top-32 bottom-24 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(74,144,164,0.2), transparent)' }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-mono text-[10px] text-[#4A90A4] tracking-widest mb-3">КАК ЭТО РАБОТАЕТ</p>
          <h2
            className="font-display font-bold text-[#F4F6F8] leading-[0.9]"
            style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
          >
            ПРОСТО И<br />
            <span className="text-[#4A90A4]">ПРОЗРАЧНО</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 flex gap-5"
            >
              {/* Step number */}
              <div
                className="font-display font-bold text-4xl leading-none shrink-0 w-14"
                style={{ color: 'rgba(74,144,164,0.25)' }}
              >
                {step.num}
              </div>
              <div>
                <h3 className="font-display font-semibold text-[#F4F6F8] text-lg mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-[#A9B1BA] text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LabSteps;

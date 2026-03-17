import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, Warehouse, Ship, PackageCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Заявка и уточнение',
    description: 'Опишите груз, маршрут и сроки. Мы рассчитаем стоимость за 10–15 минут.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Получение на складе в Китае',
    description: 'Забираем с фабрики/рынка. Проверяем, фотографируем, упаковываем.',
    icon: Warehouse,
  },
  {
    number: '03',
    title: 'Доставка и таможня',
    description: 'Авто/авия/мультимод. Таможенное оформление включено.',
    icon: Ship,
  },
  {
    number: '04',
    title: 'Выдача в Бишкеке',
    description: 'Привезём на ваш склад или пункт выдачи. Оплата по факту.',
    icon: PackageCheck,
  },
];

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        headingRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { x: '-10vw', opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.12,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-[#14161B] py-20 lg:py-32"
    >
      <div className="px-6 lg:px-[7vw]">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 lg:mb-16">
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-[#F4F6F8] mb-4">
            4 шага до получения груза
          </h2>
          <p className="text-[#A9B1BA] text-lg">
            Прозрачный процесс от заявки до доставки.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 p-6 lg:p-8 bg-[#0B0C10] rounded-lg border border-white/5"
              >
                {/* Number */}
                <div className="step-number shrink-0">{step.number}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-[#4A90A4]" />
                    <h3 className="font-display text-xl lg:text-2xl font-semibold text-[#F4F6F8]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-[#A9B1BA] text-base lg:text-lg">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block text-[#4A90A4]/30">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

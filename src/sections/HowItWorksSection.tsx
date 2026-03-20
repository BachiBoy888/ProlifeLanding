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
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1,
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
        <div className="relative">
          {/* Desktop connector line */}
          <div
            className="hidden lg:block absolute h-px bg-gradient-to-r from-transparent via-[#4A90A4]/30 to-transparent"
            style={{ top: '20px', left: '12.5%', right: '12.5%' }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 lg:gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  ref={(el) => { cardsRef.current[index] = el; }}
                  className="relative flex flex-row lg:flex-col gap-4 lg:gap-0 lg:items-start"
                >
                  {/* Mobile: vertical connector line */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute left-5 top-10 bottom-0 w-px bg-gradient-to-b from-[#4A90A4]/25 to-transparent" />
                  )}

                  {/* Step badge — lg:self-center centers it in the column so the connector line at left:12.5% aligns with badge centers */}
                  <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#14161B] border border-[#4A90A4]/40 shrink-0 lg:mb-5 lg:self-center">
                    <span className="font-display text-sm font-bold text-[#4A90A4]">{step.number}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-10 lg:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-md bg-[#4A90A4]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-[#4A90A4]" />
                      </div>
                      <h3 className="font-display text-base lg:text-lg font-semibold text-[#F4F6F8]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[#A9B1BA] text-sm lg:text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

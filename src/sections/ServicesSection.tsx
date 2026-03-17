import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Package, 
  ShoppingCart, 
  Camera, 
  Tag, 
  FileCheck, 
  Shield,
  ArrowRight 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: 'Доставка сборных грузов',
    description: 'Оптимальное решение для небольших партий. Консолидация на нашем складе в Китае.',
    icon: Package,
  },
  {
    title: 'Выкуп с 1688/Taobao',
    description: 'Помогаем с выкупом товаров с китайских площадок. Проверка продавцов и качества.',
    icon: ShoppingCart,
  },
  {
    title: 'Проверка и фотоотчёт',
    description: 'Детальная проверка товара на складе. Фото и видео каждой позиции.',
    icon: Camera,
  },
  {
    title: 'Переупаковка и маркировка',
    description: 'Профессиональная упаковка под ваш бренд. Маркировка и подготовка к продаже.',
    icon: Tag,
  },
  {
    title: 'Таможенное оформление',
    description: 'Полное сопровождение таможенной очистки. Документы и декларирование.',
    icon: FileCheck,
  },
  {
    title: 'Страхование груза',
    description: 'Страхование от повреждений и потери. Включено в базовый тариф.',
    icon: Shield,
  },
];

const ServicesSection = () => {
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
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: index * 0.08,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
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
      id="services"
      className="relative bg-[#0B0C10] py-20 lg:py-32"
    >
      <div className="px-6 lg:px-[7vw]">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 lg:mb-16">
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-[#F4F6F8] mb-4">
            Услуги
          </h2>
          <p className="text-[#A9B1BA] text-lg">
            Всё, что нужно для импорта из Китая в одном окне.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="service-card rounded-lg p-6 lg:p-8"
              >
                <div className="w-12 h-12 rounded-md bg-[#4A90A4]/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#4A90A4]" />
                </div>
                
                <h3 className="font-display text-lg font-semibold text-[#F4F6F8] mb-3">
                  {service.title}
                </h3>
                
                <p className="text-[#A9B1BA] text-sm leading-relaxed mb-5">
                  {service.description}
                </p>
                
                <a
                  href="https://api.whatsapp.com/send?phone=996990111125&text="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-[#4A90A4] hover:text-[#F4F6F8] transition-colors"
                >
                  Подробнее
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

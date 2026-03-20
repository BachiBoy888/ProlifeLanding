import { useRef, useLayoutEffect } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Package,
  ShoppingCart,
  Camera,
  Tag,
  FileCheck,
  Shield,
  ArrowRight,
  Truck,
  TrainFront,
  Plane,
  Layers,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const deliveryModes = [
  {
    icon: Truck,
    title: 'Автодоставка',
    detail: '12–18 дней',
    description: 'Прямой маршрут Китай → Бишкек через Казахстан. Подходит для большинства грузов.',
  },
  {
    icon: TrainFront,
    title: 'Железнодорожная',
    detail: '18–25 дней',
    description: 'Для крупных и тяжёлых партий. Оптимально по цене при объёме от 5 тонн.',
  },
  {
    icon: Plane,
    title: 'Авиадоставка',
    detail: '5–7 дней',
    description: 'Срочные и ценные грузы. Максимальная скорость при минимальном весе.',
  },
  {
    icon: Layers,
    title: 'Мультимодальная',
    detail: 'по запросу',
    description: 'Морской контейнер + авто/ж-д. Для крупных партий с оптимизацией стоимости.',
  },
];

const services = [
  {
    title: 'Доставка сборных грузов',
    description: 'Консолидация небольших партий на нашем складе в Китае. Платите только за свой объём — без переплат за частичный контейнер.',
    icon: Package,
  },
  {
    title: 'Выкуп с 1688 / Taobao',
    description: 'Выкупаем товар от вашего имени. Проверяем продавца, контролируем качество и комплектность до отправки.',
    icon: ShoppingCart,
  },
  {
    title: 'Проверка и фотоотчёт',
    description: 'Детальная проверка каждой позиции на складе. Фото и видео до упаковки — вы знаете, что именно едет.',
    icon: Camera,
  },
  {
    title: 'Переупаковка и маркировка',
    description: 'Усиленная упаковка под тип груза. Маркировка под ваш бренд или требования маркетплейса.',
    icon: Tag,
  },
  {
    title: 'Таможенное оформление',
    description: 'Полное сопровождение на таможне КР. Декларирование, документы, брокер — всё включено в тариф.',
    icon: FileCheck,
  },
  {
    title: 'Страхование груза',
    description: 'Страховка от повреждений и утраты на всём маршруте. Включена в базовый тариф без доплат.',
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
            Всё для импорта из Китая и Юго-Восточной Азии — в одном окне.
          </p>
        </div>

        {/* Delivery modes */}
        <div className="mb-12 lg:mb-16">
          <p className="mono-label text-[#A9B1BA] mb-6">Способы доставки</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deliveryModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={mode.title}
                  className="bg-[#14161B] border border-white/5 rounded-lg p-5"
                  whileHover={{ y: -4, borderColor: 'rgba(74,144,164,0.3)' }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-md bg-[#4A90A4]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#4A90A4]" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-sm text-[#F4F6F8]">{mode.title}</p>
                      <p className="font-mono text-xs text-[#4A90A4]">{mode.detail}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#A9B1BA] leading-relaxed">{mode.description}</p>
                </motion.div>
              );
            })}
          </div>
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
                  href={`https://api.whatsapp.com/send?phone=996990111125&text=${encodeURIComponent(`Здравствуйте, интересует услуга «${service.title}»`)}`}
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

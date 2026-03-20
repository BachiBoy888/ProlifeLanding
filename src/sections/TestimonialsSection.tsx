import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useInView, useMotionValue, useSpring, useMotionValueEvent } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: 'Доставили за 11 дней, как и обещали. Проверка на складе сэкономила нам время и деньги.',
    author: 'Айгуль К.',
    company: 'Магазин детской одежды',
    rating: 5,
  },
  {
    quote: 'Удобно, что таможня включена. Не пришлось искать отдельного брокера.',
    author: 'Данияр Т.',
    company: 'Wildberries seller',
    rating: 5,
  },
  {
    quote: 'Выкупали партию с 1688. Всё проверили, переупаковали, доставили целым.',
    author: 'Марат С.',
    company: 'Оптовый импортёр',
    rating: 5,
  },
];

const AnimatedCounter = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const numMatch = value.match(/^(\d+)(.*)/);
  const numericPart = numMatch ? parseInt(numMatch[1]) : 0;
  const suffix = numMatch ? numMatch[2] : '';
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 55, damping: 18 });
  const [display, setDisplay] = useState('0');

  useMotionValueEvent(spring, 'change', (v) => {
    setDisplay(String(Math.round(v)));
  });

  useEffect(() => {
    if (isInView && numericPart > 0) motionVal.set(numericPart);
  }, [isInView, motionVal, numericPart]);

  return (
    <div ref={ref} className="text-center p-5 bg-[#0B0C10] rounded-lg">
      <p className="font-display text-2xl lg:text-3xl font-bold text-[#4A90A4] mb-1">
        {display}{suffix}
      </p>
      <p className="text-sm text-[#A9B1BA]">{label}</p>
    </div>
  );
};

const TestimonialsSection = () => {
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
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1,
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
      id="testimonials"
      className="relative bg-[#14161B] py-20 lg:py-32"
    >
      <div className="px-6 lg:px-[7vw]">
        {/* Heading */}
        <div ref={headingRef} className="mb-12 lg:mb-16">
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-[#F4F6F8] mb-4">
            Нам доверяют
          </h2>
          <p className="text-[#A9B1BA] text-lg">
            Более 5 000 доставок с 2015 года. Работаем с предпринимателями, магазинами и маркетплейсами.
          </p>
        </div>

        {/* Stats — выше testimonials для быстрого trust building */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {[
            { value: '2015', label: 'Год основания' },
            { value: '5000+', label: 'Доставленных грузов' },
            { value: '98%', label: 'Довольных клиентов' },
            { value: '12 дн', label: 'Средний срок доставки' },
          ].map((stat) => (
            <AnimatedCounter key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="testimonial-card rounded-lg p-6 lg:p-8"
            >
              {/* Quote icon */}
              <div className="mb-5">
                <Quote className="w-8 h-8 text-[#4A90A4]/40" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#4A90A4] text-[#4A90A4]" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-[#F4F6F8] text-base lg:text-lg leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="border-t border-white/5 pt-4">
                <p className="font-display font-semibold text-[#F4F6F8]">
                  {testimonial.author}
                </p>
                <p className="text-sm text-[#A9B1BA]">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

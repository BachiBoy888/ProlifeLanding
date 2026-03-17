import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MapPin, Package, Camera } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CoverageSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.3,
        },
      });

      // ENTRANCE (0-30%)
      scrollTl.fromTo(
        headlineRef.current,
        { y: '90vh', opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        imageRef.current,
        { x: '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        contentRef.current,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-45vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        imageRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        contentRef.current,
        { y: 0, opacity: 1 },
        { y: '12vh', opacity: 0, ease: 'power2.in' },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const cities = ['ГУАНЧЖОУ', 'ИУ', 'ШЭНЬЧЖЭНЬ', 'ФОШАНЬ', 'ДОНГУАНЬ'];

  return (
    <section
      ref={sectionRef}
      id="routes"
      className="pinned-section bg-[#0B0C10] z-30"
    >
      {/* Hero Image (right side) */}
      <div
        ref={imageRef}
        className="absolute hidden lg:block"
        style={{
          left: '54vw',
          top: '10vh',
          width: '40vw',
          height: '80vh',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1200&q=80"
          alt="Port aerial view"
          className="w-full h-full object-cover rounded-md"
          style={{ filter: 'saturate(0.5) contrast(1.1)' }}
        />
      </div>

      {/* Mobile background */}
      <div className="absolute inset-0 lg:hidden">
        <img
          src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80"
          alt="Port aerial view"
          className="w-full h-full object-cover opacity-15"
          style={{ filter: 'saturate(0.5) contrast(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/85 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[7vw]">
        {/* Headline */}
        <div
          ref={headlineRef}
          className="mb-6 lg:mb-8"
          style={{ maxWidth: '46vw' }}
        >
          <div className="section-headline text-[#F4F6F8] leading-[0.9]">
            <div>РАБОТАЕМ</div>
            <div>СО ВСЕМИ</div>
            <div className="text-[#4A90A4]">ГОРОДАМИ</div>
          </div>
        </div>

        {/* Content block */}
        <div ref={contentRef} style={{ maxWidth: '38vw' }}>
          {/* Cities */}
          <div className="flex flex-wrap gap-2 mb-5">
            {cities.map((city) => (
              <span
                key={city}
                className="mono-label text-[#4A90A4] px-3 py-1.5 bg-[#4A90A4]/10 rounded"
              >
                {city}
              </span>
            ))}
          </div>
          
          <p className="text-[#A9B1BA] text-base lg:text-lg mb-6 leading-relaxed">
            Заберём груз с фабрики или рынка. Проверим комплектацию. Упакуем под ваш бренд.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-[#F4F6F8]">
              <MapPin className="w-4 h-4 text-[#4A90A4]" />
              <span>Забор от двери</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#F4F6F8]">
              <Package className="w-4 h-4 text-[#4A90A4]" />
              <span>Проверка товара</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#F4F6F8]">
              <Camera className="w-4 h-4 text-[#4A90A4]" />
              <span>Фотоотчёт</span>
            </div>
          </div>

          <a
            href="https://api.whatsapp.com/send?phone=996990111125&text="
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-sm inline-flex"
          >
            Запросить сборку
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CoverageSection;

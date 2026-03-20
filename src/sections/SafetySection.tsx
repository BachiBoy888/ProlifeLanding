import { useRef, useLayoutEffect } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Shield, Package, Thermometer, Anchor } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SafetySection = () => {
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
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%)
      scrollTl.fromTo(
        headlineRef.current,
        { y: '90vh', opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        imageRef.current,
        { x: '60vw', opacity: 0, scale: 1.08 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        contentRef.current,
        { y: '12vh', opacity: 0 },
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
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pinned-section bg-[#0B0C10] z-50"
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
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80"
          alt="Truck fleet"
          className="w-full h-full object-cover rounded-md"
          loading="lazy"
          width={1200}
          height={900}
          style={{ filter: 'saturate(0.5) contrast(1.1)' }}
        />
      </div>

      {/* Mobile background */}
      <div className="absolute inset-0 lg:hidden">
        <img
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80"
          alt=""
          className="w-full h-full object-cover opacity-15"
          loading="lazy"
          width={800}
          height={600}
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
            <div>СОХРАН</div>
            <div>НОСТЬ</div>
            <div className="text-[#4A90A4]">ГРУЗА</div>
          </div>
        </div>

        {/* Content block */}
        <div ref={contentRef} style={{ maxWidth: '38vw' }}>
          <p className="mono-label text-[#A9B1BA] mb-4">
            СТРАХОВАНИЕ · ЖЁСТКАЯ УПАКОВКА · КРЕПЛЕНИЕ · КОНТРОЛЬ ТЕМПЕРАТУРЫ
          </p>
          
          <p className="text-[#A9B1BA] text-base lg:text-lg mb-6 leading-relaxed">
            Работаем с хрупким, тяжёлым и ценным грузом. Страховка включена в базовый тариф.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="flex items-center gap-2 text-sm text-[#F4F6F8]">
              <Shield className="w-4 h-4 text-[#4A90A4]" />
              <span>Страхование</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#F4F6F8]">
              <Package className="w-4 h-4 text-[#4A90A4]" />
              <span>Жёсткая упаковка</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#F4F6F8]">
              <Anchor className="w-4 h-4 text-[#4A90A4]" />
              <span>Надёжное крепление</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#F4F6F8]">
              <Thermometer className="w-4 h-4 text-[#4A90A4]" />
              <span>Контроль температуры</span>
            </div>
          </div>

          <motion.a
            href={`https://api.whatsapp.com/send?phone=996990111125&text=${encodeURIComponent('Здравствуйте, хочу уточнить условия страхования груза')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-sm inline-flex"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.12 }}
          >
            Уточнить условия
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default SafetySection;

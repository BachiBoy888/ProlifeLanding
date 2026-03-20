import { useRef, useLayoutEffect } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SpeedSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const ctx = gsap.context(() => {
        const scrollTl = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 },
        });
        scrollTl.fromTo(headlineRef.current, { x: '-55vw', opacity: 0, rotateZ: -2 }, { x: 0, opacity: 1, rotateZ: 0, ease: 'none' }, 0);
        scrollTl.fromTo(imageRef.current, { x: '60vw', opacity: 0, scale: 1.08 }, { x: 0, opacity: 1, scale: 1, ease: 'none' }, 0);
        scrollTl.fromTo(contentRef.current, { y: '18vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.1);
        scrollTl.fromTo(headlineRef.current, { y: 0, opacity: 1 }, { y: '-22vh', opacity: 0, ease: 'power2.in' }, 0.7);
        scrollTl.fromTo(imageRef.current, { y: 0, opacity: 1 }, { y: '22vh', opacity: 0, ease: 'power2.in' }, 0.7);
        scrollTl.fromTo(contentRef.current, { x: 0, opacity: 1 }, { x: '-18vw', opacity: 0, ease: 'power2.in' }, 0.75);
      }, section);
      return () => ctx.revert();
    });

    // Mobile: no pin — section scrolls naturally as part of the document.
    // Pinned sections on mobile create scroll traps in in-app browsers (Instagram/WebView).

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pinned-section bg-[#0B0C10] z-20"
    >
      {/* Hero Image (right side) */}
      <div
        ref={imageRef}
        className="absolute hidden lg:block"
        style={{
          left: '56vw',
          top: '10vh',
          width: '38vw',
          height: '80vh',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80"
          alt="Container loading"
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
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
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
      <div className="relative z-10 lg:h-full flex flex-col justify-center pt-20 pb-10 lg:pt-0 lg:pb-0 px-6 lg:px-[7vw]">
        {/* Headline */}
        <div
          ref={headlineRef}
          className="mb-6 lg:mb-8 lg:max-w-[46vw]"
        >
          <div className="section-headline text-[#F4F6F8] leading-[0.9]">
            <div>ОТ</div>
            <div className="text-[#4A90A4]">12</div>
            <div>ДНЕЙ</div>
          </div>
        </div>

        {/* Content block */}
        <div ref={contentRef} className="lg:max-w-[36vw]">
          <p className="mono-label text-[#A9B1BA] mb-4">
            АВИА · АВТО · МУЛЬТИМОДАЛЬНЫЕ РЕЙСЫ ПОД КЛЮЧ
          </p>
          
          <p className="text-[#A9B1BA] text-base lg:text-lg mb-6 leading-relaxed">
            Сроки фиксируем в договоре. Отслеживание на каждом этапе.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-[#F4F6F8]">
              <Clock className="w-4 h-4 text-[#4A90A4]" />
              <span>Отслеживание 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#F4F6F8]">
              <Shield className="w-4 h-4 text-[#4A90A4]" />
              <span>Гарантия сроков</span>
            </div>
          </div>

          <motion.a
            href="#routes"
            className="btn-outline text-sm inline-flex"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.12 }}
          >
            Узнать маршруты
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default SpeedSection;

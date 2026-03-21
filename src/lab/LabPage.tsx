import { useCallback } from 'react';
import LabHero from './components/LabHero';
import LabCalc from './components/LabCalc';
import LabProof from './components/LabProof';
import LabSteps from './components/LabSteps';
import LabFinalCTA from './components/LabFinalCTA';

const LabPage = () => {
  const scrollToCalc = useCallback(() => {
    const el = document.getElementById('calculator');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div
      className="relative min-h-screen"
      style={{ background: '#050608', color: '#F4F6F8' }}
    >
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Minimal header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 h-16 flex items-center justify-between border-b border-white/[0.05]" style={{ background: 'rgba(5,6,8,0.85)', backdropFilter: 'blur(16px)' }}>
        <a href="/#" className="font-display font-bold text-[#F4F6F8] text-lg tracking-tight">
          PRO<span className="text-[#4A90A4]">LIFE</span>
        </a>
        <div className="flex items-center gap-4">
          <a
            href="/#"
            className="font-mono text-xs text-[#A9B1BA] hover:text-[#F4F6F8] transition-colors"
          >
            ← Основной сайт
          </a>
          <a
            href={`https://api.whatsapp.com/send?phone=996990111125&text=${encodeURIComponent('Здравствуйте, хочу узнать о доставке из Китая')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs text-[#050608] bg-[#4A90A4]"
            style={{ boxShadow: '0 0 20px rgba(74,144,164,0.35)' }}
          >
            WhatsApp
          </a>
        </div>
      </header>

      {/* Sections */}
      <main>
        <LabHero onCalcClick={scrollToCalc} />
        <LabCalc />
        <LabProof />
        <LabSteps />
        <LabFinalCTA />
      </main>

      {/* Minimal footer */}
      <footer className="px-6 py-8 border-t border-white/[0.05] text-center">
        <p className="font-mono text-xs text-[#A9B1BA]/50">
          © 2025 ProLife Cargo · Доставка из Китая в Бишкек ·{' '}
          <a href="#/privacy" className="hover:text-[#A9B1BA] transition-colors">
            Политика конфиденциальности
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LabPage;

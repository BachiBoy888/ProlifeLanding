import { useState, useRef } from 'react';
import { trackEvent, getUtmParams, getUtmParamsCamel } from '../lib/analytics';
import { submitLead, type LeadPayload } from '../lib/submitLead';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import {
  Calculator as CalcIcon,
  ArrowRight,
  MessageCircle,
  X,
  Check,
  User,
  Phone,
  AlertCircle,
} from 'lucide-react';
import ConsentCheckbox from './ConsentCheckbox';

// Пороги плотности для выбора базы расчёта (кг/м³)
const DENSITY_LOW = 200;   // ниже → считать по м³
const DENSITY_HIGH = 250;  // выше → считать по кг
const MIN_PRICE = 150;     // минимальная стоимость заявки ($)

// Надбавка по точке сбора ($)
const CITY_SURCHARGE: Record<string, number> = {
  'Гуанчжоу': 0,
  'Фошань': 0,
  'Дунгуань': 0,
  'Шэньчжэнь': 15,
  'Иу': 30,
  'Другой город': 40,
};

const PACKAGES = [
  {
    id: 'economy' as const,
    name: 'Эконом',
    rateKg: 0.55,
    rateM3: 145,
    days: '14–18 дней',
    daysMin: 14,
    daysMax: 18,
    features: ['Автодоставка', 'Трекинг груза'],
  },
  {
    id: 'standard' as const,
    name: 'Стандарт',
    rateKg: 0.70,
    rateM3: 165,
    days: '12–15 дней',
    daysMin: 12,
    daysMax: 15,
    features: ['Авто + ж/д', 'Страховка груза', 'Трекинг груза'],
    popular: true,
  },
  {
    id: 'premium' as const,
    name: 'Премиум',
    rateKg: 0.90,
    rateM3: 185,
    days: '10–12 дней',
    daysMin: 10,
    daysMax: 12,
    features: ['Приоритетный маршрут', 'Услуга по растаможке включена', 'Страховка груза', 'Личный менеджер 24/7'],
  },
];

const CITIES = ['Гуанчжоу', 'Иу', 'Шэньчжэнь', 'Фошань', 'Дунгуань', 'Другой город'];

type PackageId = 'economy' | 'standard' | 'premium';
type Step = 'form' | 'result' | 'success';

interface FormData {
  weight: string;
  volume: string;
  city: string;
  packageId: PackageId;
}

interface ContactData {
  name: string;
  phone: string;
  company: string;
  email: string;
  note: string;
}

const Calculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<FormData>({
    weight: '',
    volume: '',
    city: 'Гуанчжоу',
    packageId: 'standard',
  });
  const [contact, setContact] = useState<ContactData>({
    name: '',
    phone: '+996',
    company: '',
    email: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState('');
  const leadStartedRef = useRef(false);

  const selectedPackage = PACKAGES.find((p) => p.id === form.packageId)!;

  const calcResult = () => {
    const w = parseFloat(form.weight) || 0;
    const v = parseFloat(form.volume) || 0;
    const pkg = selectedPackage;

    const byKg = w * pkg.rateKg;
    const byM3 = v * pkg.rateM3;

    // Определяем базу расчёта по плотности груза
    let base: 'kg' | 'm3' | 'max';
    let rawPrice: number;

    if (w > 0 && v > 0) {
      const density = w / v;
      if (density < DENSITY_LOW) {
        base = 'm3';
        rawPrice = byM3;
      } else if (density > DENSITY_HIGH) {
        base = 'kg';
        rawPrice = byKg;
      } else {
        base = 'max';
        rawPrice = Math.max(byKg, byM3);
      }
    } else if (w > 0) {
      base = 'kg';
      rawPrice = byKg;
    } else {
      base = 'm3';
      rawPrice = byM3;
    }

    const surcharge = CITY_SURCHARGE[form.city] ?? 0;
    const price = Math.max(Math.round(rawPrice + surcharge), MIN_PRICE);

    return {
      price,
      base,
      byKg: Math.round(byKg),
      byM3: Math.round(byM3),
      density: v > 0 && w > 0 ? Math.round(w / v) : null,
      surcharge,
    };
  };

  const openModal = () => {
    setStep('form');
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
    trackEvent('cta_clicked', { location: 'hero' });
    trackEvent('calculator_started');
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
    setConsentChecked(false);
    setConsentError('');
    leadStartedRef.current = false;
  };

  const handleSendRequest = async () => {
    if (!contact.name.trim()) {
      setSubmitError('Пожалуйста, укажите ваше имя.');
      return;
    }
    if (!consentChecked) {
      setConsentError('Необходимо согласие на обработку персональных данных');
      return;
    }
    setConsentError('');
    setSubmitError('');
    setLoading(true);
    setSubmitError('');

    const calcRes = calcResult();
    const pkg = selectedPackage;

    const payload: LeadPayload = {
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      company: contact.company.trim() || undefined,
      weight: parseFloat(form.weight) || 0,
      volume: parseFloat(form.volume) || 0,
      deliveryType: form.packageId,
      originCity: form.city,
      estimatedPrice: calcRes.price,
      estimatedCurrency: 'USD',
      estimatedDaysMin: pkg.daysMin,
      estimatedDaysMax: pkg.daysMax,
      source: 'prolife_site',
      leadEntryPoint: 'calculator',
      ...getUtmParamsCamel(),
      website: '',
    };

    try {
      const res = await submitLead(payload);

      if (res.ok) {
        trackEvent('lead_submitted_backend', {
          source: 'calculator',
          deliveryType: payload.deliveryType,
          weight: payload.weight,
          volume: payload.volume,
          estimatedPrice: payload.estimatedPrice,
          estimatedCurrency: payload.estimatedCurrency,
          estimatedDaysMin: payload.estimatedDaysMin,
          estimatedDaysMax: payload.estimatedDaysMax,
          ...getUtmParams(),
        });
        setStep('success');
        return;
      }

      if (res.status === 400) {
        setSubmitError('Проверьте заполненные данные и попробуйте ещё раз.');
      } else if (res.status === 429) {
        setSubmitError('Слишком много попыток. Попробуйте через минуту.');
      } else {
        setSubmitError('Ошибка на сервере. Попробуйте ещё раз или напишите нам напрямую.');
      }
    } catch {
      setSubmitError('Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const result = step !== 'form' ? calcResult() : null;

  const stepOrder: Step[] = ['form', 'result', 'success'];
  const currentStepIdx = stepOrder.indexOf(step);

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(11, 12, 16, 0.92)', backdropFilter: 'blur(12px)' }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) closeModal(); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-white/[0.2] bg-[#1A1D27]"
            style={{ boxShadow: '0 0 0 1px rgba(74,144,164,0.15), 0 24px 80px rgba(0,0,0,0.85), 0 8px 32px rgba(0,0,0,0.6)' }}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
        {/* Шапка модального окна */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 border-b border-white/[0.1] bg-[#1A1D27]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#4A90A4]/20 flex items-center justify-center">
              <CalcIcon className="w-4 h-4 text-[#4A90A4]" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-[#F4F6F8] text-base">
                {step === 'form' && 'Расчёт стоимости'}
                {step === 'result' && 'Результат и оформление'}
                {step === 'success' && 'Заявка отправлена'}
              </h3>
              {step !== 'success' && (
                <div className="flex items-center gap-1 mt-1">
                  {(['form', 'result'] as Step[]).map((s, i) => (
                    <div
                      key={s}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        currentStepIdx >= i ? 'w-8 bg-[#4A90A4]' : 'w-4 bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 text-[#A9B1BA] hover:text-[#F4F6F8] transition-colors rounded-md hover:bg-white/5"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Тело модального окна */}
        <div className="p-5">
          <AnimatePresence mode="wait">

          {/* ── ШАГ 1: ФОРМА ── */}
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mono-label text-[#C8D0D8] block mb-2">Вес, кг</label>
                  <input
                    type="number"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="mono-label text-[#C8D0D8] block mb-2">Объём, м³</label>
                  <input
                    type="number"
                    value={form.volume}
                    onChange={(e) => setForm({ ...form, volume: e.target.value })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mono-label text-[#C8D0D8] block mb-2">Точка сбора груза</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="input-field text-sm appearance-none cursor-pointer"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mono-label text-[#C8D0D8] block mb-3">Пакет доставки</label>
                <div className="flex flex-col gap-1.5">
                  {PACKAGES.map((pkg) => (
                    <motion.button
                      key={pkg.id}
                      onClick={() => setForm({ ...form, packageId: pkg.id })}
                      className={`relative text-left rounded-lg border p-3.5 transition-all duration-200 ${
                        form.packageId === pkg.id
                          ? 'border-[#4A90A4] bg-[#4A90A4]/[0.12] shadow-[0_0_0_1px_rgba(74,144,164,0.25)]'
                          : 'border-white/10 bg-[#141720] hover:border-white/25 hover:bg-[#1E2130]'
                      }`}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                    >
                      {'popular' in pkg && (
                        <span className="absolute top-2.5 right-3 text-[10px] font-mono bg-[#4A90A4]/20 text-[#4A90A4] px-2 py-0.5 rounded-full">
                          Популярный
                        </span>
                      )}
                      <div className="flex items-start justify-between mb-1.5 pr-24">
                        <span className="font-display font-semibold text-[#F4F6F8] text-base">{pkg.name}</span>
                        <span className="font-mono font-bold text-[#4A90A4] text-sm leading-tight text-right">
                          ${pkg.rateKg}/кг<br />${pkg.rateM3}/м³
                        </span>
                      </div>
                      <p className="text-xs text-[#C8D0D8] mb-1.5">{pkg.days}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {pkg.features.map((f) => (
                          <span key={f} className="flex items-center gap-1 text-xs text-[#A9B1BA]">
                            <Check className="w-3 h-3 text-[#4A90A4] shrink-0" />
                            {f}
                          </span>
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setStep('result');
                  trackEvent('calculator_completed', {
                    package: form.packageId,
                    city: form.city,
                    weight: parseFloat(form.weight) || undefined,
                    volume: parseFloat(form.volume) || undefined,
                    estimated_price: calcResult().price,
                  });
                }}
                disabled={!form.weight && !form.volume}
                className="btn-primary w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Рассчитать стоимость
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <p className="text-xs text-[#A9B1BA] text-center">
                * Расчёт по плотности: плотность = вес ÷ объём (кг/м³)
              </p>
            </div>
            </motion.div>
          )}

          {/* ── ШАГ 2: РЕЗУЛЬТАТ + ЗАЯВКА (объединено) ── */}
          {step === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
            <div className="space-y-3.5">

              {/* Цена и срок */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#13151E] rounded-lg p-3 text-center col-span-1">
                  <p className="mono-label text-[#A9B1BA] mb-1">Стоимость</p>
                  <p className="font-display font-bold text-2xl text-[#4A90A4]">~${result.price}</p>
                </div>
                <div className="bg-[#13151E] rounded-lg p-3 text-center col-span-1">
                  <p className="mono-label text-[#A9B1BA] mb-1">Срок</p>
                  <p className="font-display font-bold text-sm text-[#F4F6F8] leading-tight mt-1">{selectedPackage.days}</p>
                </div>
              </div>

              {/* Пакет */}
              <div className="rounded-lg border border-[#4A90A4]/30 bg-[#4A90A4]/5 p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-semibold text-[#F4F6F8] text-sm">
                    Пакет: {selectedPackage.name}
                  </span>
                  <span className="font-mono text-[#4A90A4] text-xs">${selectedPackage.rateKg}/кг · ${selectedPackage.rateM3}/м³</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {selectedPackage.features.map((f) => (
                    <span key={f} className="flex items-center gap-1 text-xs text-[#A9B1BA]">
                      <Check className="w-3 h-3 text-[#4A90A4] shrink-0" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Инлайн форма — без отдельного шага */}
              <div className="rounded-lg border border-white/[0.08] bg-[#13151E] p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="w-4 h-4 text-[#4A90A4]" />
                  <p className="font-display font-semibold text-[#F4F6F8] text-sm">Получить точный расчёт</p>
                </div>
                <p className="text-xs text-[#A9B1BA] mb-3 leading-relaxed">
                  Менеджер свяжется в течение 15 минут и подтвердит итоговую стоимость.
                </p>
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <div>
                    <label className="mono-label text-[#C8D0D8] flex items-center gap-1 mb-1.5">
                      <User className="w-3 h-3" />Имя *
                    </label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => {
                        if (!leadStartedRef.current) {
                          leadStartedRef.current = true;
                          trackEvent('lead_started', { source: 'calculator' });
                        }
                        setContact({ ...contact, name: e.target.value });
                      }}
                      placeholder="Иван"
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="mono-label text-[#C8D0D8] flex items-center gap-1 mb-1.5">
                      <Phone className="w-3 h-3" />Телефон *
                    </label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const filtered = raw.startsWith('+')
                          ? '+' + raw.slice(1).replace(/[^\d]/g, '')
                          : raw.replace(/[^\d]/g, '');
                        if (!leadStartedRef.current) {
                          leadStartedRef.current = true;
                          trackEvent('lead_started', { source: 'calculator' });
                        }
                        setContact({ ...contact, phone: filtered });
                      }}
                      placeholder="+996 ___ __ __ __"
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <ConsentCheckbox
                    checked={consentChecked}
                    onChange={(v) => { setConsentChecked(v); if (v) setConsentError(''); }}
                    error={consentError}
                  />
                </div>

                {submitError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300 leading-relaxed">{submitError}</p>
                  </div>
                )}

                <button
                  onClick={handleSendRequest}
                  disabled={!contact.name.trim() || !contact.phone.trim() || loading}
                  className="btn-primary w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Отправить заявку
                    </>
                  )}
                </button>
                <p className="text-xs text-[#A9B1BA] text-center mt-2">
                  * Только телефон обязателен · Без предоплаты
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep('form')}
                  className="text-xs text-[#A9B1BA] hover:text-[#F4F6F8] transition-colors"
                >
                  ← Изменить параметры
                </button>
                <p className="text-xs text-[#A9B1BA]">* Предварительный расчёт</p>
              </div>
            </div>
            </motion.div>
          )}

          {/* ── ШАГ 4: УСПЕХ ── */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
            <div className="py-10 flex flex-col items-center text-center gap-5">
              <motion.div
                className="w-16 h-16 rounded-full bg-[#4A90A4]/20 flex items-center justify-center"
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 0.05 }}
              >
                <Check className="w-8 h-8 text-[#4A90A4]" />
              </motion.div>
              <div>
                <h4 className="font-display font-semibold text-[#F4F6F8] text-lg mb-2">Заявка отправлена!</h4>
                <p className="text-sm text-[#A9B1BA] leading-relaxed">
                  Менеджер свяжется с вами в течение часа<br />
                  и подтвердит точную стоимость доставки.
                </p>
              </div>
              <motion.button
                onClick={closeModal}
                className="btn-outline text-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
              >
                Закрыть
              </motion.button>
            </div>
            </motion.div>
          )}

          </AnimatePresence>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Teaser-блок (рендерится внутри HeroSection) */}
      <div className="panel-glass rounded-lg p-5 lg:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-md bg-[#4A90A4]/20 flex items-center justify-center">
            <CalcIcon className="w-5 h-5 text-[#4A90A4]" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-[#F4F6F8]">Расчёт стоимости</h3>
            <p className="text-xs text-[#A9B1BA]">Узнайте цену за 10 секунд</p>
          </div>
        </div>

        <p className="text-sm text-[#A9B1BA] mb-5 leading-relaxed">
          Введите вес и объём груза, выберите пакет — и сразу увидите ориентировочную стоимость.
          Менеджер подтвердит точную цену в течение часа.
        </p>

        <div className="flex flex-col gap-2 mb-5">
          {[
            'Таможня и сборы уже включены в цену',
            'Три пакета под разные задачи и бюджет',
            'Заявка без предоплаты — просто оставьте контакт',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-[#4A90A4] shrink-0 mt-0.5" />
              <span className="text-xs text-[#A9B1BA]">{item}</span>
            </div>
          ))}
        </div>

        <motion.button
          onClick={openModal}
          className="btn-primary w-full text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.12 }}
        >
          Рассчитать стоимость
          <ArrowRight className="w-4 h-4 ml-2" />
        </motion.button>
        <p className="text-xs text-[#A9B1BA] text-center mt-2">
          Ответим за 15 минут · Без предоплаты
        </p>
      </div>

      {/* Модальное окно рендерится в document.body через portal */}
      {createPortal(modal, document.body)}
    </>
  );
};

export default Calculator;

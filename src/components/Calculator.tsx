import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Calculator as CalcIcon,
  ArrowRight,
  MessageCircle,
  X,
  Check,
  ChevronRight,
  User,
  Building2,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';

// Коэффициент объёмного веса (стандартный для авто/ж-д)
const VOLUMETRIC_FACTOR = 167;

const PACKAGES = [
  {
    id: 'economy' as const,
    name: 'Эконом',
    rate: 2.9,
    days: '14–18 дней',
    features: ['Автодоставка', 'Таможня включена', 'Трекинг груза'],
  },
  {
    id: 'standard' as const,
    name: 'Стандарт',
    rate: 3.1,
    days: '12–15 дней',
    features: ['Авто + ж/д', 'Таможня включена', 'Страховка груза', 'Трекинг груза'],
    popular: true,
  },
  {
    id: 'premium' as const,
    name: 'Премиум',
    rate: 3.5,
    days: '10–12 дней',
    features: ['Приоритетный маршрут', 'Таможня включена', 'Страховка груза', 'Личный менеджер 24/7'],
  },
];

const CITIES = ['Гуанчжоу', 'Иу', 'Шэньчжэнь', 'Фошань', 'Дунгуань', 'Другой город'];

type PackageId = 'economy' | 'standard' | 'premium';
type Step = 'form' | 'result' | 'contact' | 'success';

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
    phone: '',
    company: '',
    email: '',
    note: '',
  });

  const selectedPackage = PACKAGES.find((p) => p.id === form.packageId)!;

  const calcResult = () => {
    const w = parseFloat(form.weight) || 0;
    const v = parseFloat(form.volume) || 0;
    const volWeight = v * VOLUMETRIC_FACTOR;
    const billable = Math.max(w, volWeight);
    const price = Math.round(billable * selectedPackage.rate);
    return { billable: Math.round(billable * 10) / 10, price };
  };

  const openModal = () => {
    setStep('form');
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  const handleSendRequest = () => {
    const result = calcResult();
    const lines: string[] = [
      '📦 Заявка с сайта Prolife Logistics',
      '',
      'Параметры груза:',
      `• Вес: ${form.weight || '—'} кг`,
      `• Объём: ${form.volume || '—'} м³`,
      `• Точка сбора: ${form.city}`,
      `• Пакет: ${selectedPackage.name} ($${selectedPackage.rate}/кг)`,
      `• Предв. стоимость: ~$${result.price}`,
      '',
      'Контакты:',
      `• Имя: ${contact.name || '—'}`,
      `• Телефон: ${contact.phone || '—'}`,
    ];
    if (contact.company) lines.push(`• Компания: ${contact.company}`);
    if (contact.email) lines.push(`• Email: ${contact.email}`);
    if (contact.note) lines.push(`• Примечание: ${contact.note}`);

    const url = `https://api.whatsapp.com/send?phone=996990111125&text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setStep('success');
  };

  const result = step !== 'form' ? calcResult() : null;

  const stepOrder: Step[] = ['form', 'result', 'contact', 'success'];
  const currentStepIdx = stepOrder.indexOf(step);

  const modal = isOpen ? (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(11, 12, 16, 0.92)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-[#0F1117]"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
      >
        {/* Шапка модального окна */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0F1117]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#4A90A4]/20 flex items-center justify-center">
              <CalcIcon className="w-4 h-4 text-[#4A90A4]" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-[#F4F6F8] text-sm">
                {step === 'form' && 'Расчёт стоимости'}
                {step === 'result' && 'Предварительный расчёт'}
                {step === 'contact' && 'Контактные данные'}
                {step === 'success' && 'Заявка отправлена'}
              </h3>
              {step !== 'success' && (
                <div className="flex items-center gap-1 mt-1">
                  {(['form', 'result', 'contact'] as Step[]).map((s, i) => (
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
        <div className="p-6">

          {/* ── ШАГ 1: ФОРМА ── */}
          {step === 'form' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mono-label text-[#A9B1BA] block mb-2">Вес, кг</label>
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
                  <label className="mono-label text-[#A9B1BA] block mb-2">Объём, м³</label>
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
                <label className="mono-label text-[#A9B1BA] block mb-2">Точка сбора груза</label>
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
                <label className="mono-label text-[#A9B1BA] block mb-3">Пакет доставки</label>
                <div className="flex flex-col gap-2">
                  {PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setForm({ ...form, packageId: pkg.id })}
                      className={`relative text-left rounded-lg border p-4 transition-all duration-200 ${
                        form.packageId === pkg.id
                          ? 'border-[#4A90A4] bg-[#4A90A4]/10'
                          : 'border-white/10 bg-[#0B0C10] hover:border-white/20'
                      }`}
                    >
                      {'popular' in pkg && (
                        <span className="absolute top-3 right-3 text-[10px] font-mono bg-[#4A90A4]/20 text-[#4A90A4] px-2 py-0.5 rounded-full">
                          Популярный
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-1.5 pr-24">
                        <span className="font-display font-semibold text-[#F4F6F8] text-sm">{pkg.name}</span>
                        <span className="font-mono font-bold text-[#4A90A4] text-sm">${pkg.rate}/кг</span>
                      </div>
                      <p className="text-xs text-[#A9B1BA] mb-2">{pkg.days}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {pkg.features.map((f) => (
                          <span key={f} className="flex items-center gap-1 text-xs text-[#A9B1BA]">
                            <Check className="w-3 h-3 text-[#4A90A4] shrink-0" />
                            {f}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep('result')}
                disabled={!form.weight && !form.volume}
                className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Рассчитать стоимость
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <p className="text-xs text-[#A9B1BA] text-center">
                * 1 м³ = {VOLUMETRIC_FACTOR} кг (коэффициент объёмного веса)
              </p>
            </div>
          )}

          {/* ── ШАГ 2: РЕЗУЛЬТАТ ── */}
          {step === 'result' && result && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0B0C10] rounded-lg p-3 text-center">
                  <p className="mono-label text-[#A9B1BA] mb-1">Стоимость</p>
                  <p className="font-display font-bold text-xl text-[#4A90A4]">~${result.price}</p>
                </div>
                <div className="bg-[#0B0C10] rounded-lg p-3 text-center">
                  <p className="mono-label text-[#A9B1BA] mb-1">Срок</p>
                  <p className="font-display font-bold text-sm text-[#F4F6F8] leading-tight mt-1">{selectedPackage.days}</p>
                </div>
                <div className="bg-[#0B0C10] rounded-lg p-3 text-center">
                  <p className="mono-label text-[#A9B1BA] mb-1">Расч. вес</p>
                  <p className="font-display font-bold text-xl text-[#F4F6F8]">{result.billable} кг</p>
                </div>
              </div>

              <div className="rounded-lg border border-[#4A90A4]/30 bg-[#4A90A4]/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-semibold text-[#F4F6F8] text-sm">
                    Пакет: {selectedPackage.name}
                  </span>
                  <span className="font-mono text-[#4A90A4] text-sm">${selectedPackage.rate}/кг</span>
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

              <div className="bg-[#0B0C10] rounded-lg p-4 space-y-1.5">
                <p className="mono-label text-[#A9B1BA]">Как посчитано:</p>
                {parseFloat(form.volume) > 0 && (
                  <p className="text-xs text-[#A9B1BA]">
                    Объёмный вес: {form.volume} × {VOLUMETRIC_FACTOR} ={' '}
                    {Math.round(parseFloat(form.volume) * VOLUMETRIC_FACTOR * 10) / 10} кг
                  </p>
                )}
                <p className="text-xs text-[#A9B1BA]">
                  Расчётный вес: max({form.weight || 0},{' '}
                  {parseFloat(form.volume) ? Math.round(parseFloat(form.volume) * VOLUMETRIC_FACTOR * 10) / 10 : 0}
                  ) = {result.billable} кг
                </p>
                <p className="text-xs text-[#F4F6F8] font-medium">
                  Итого: {result.billable} × ${selectedPackage.rate} = ~${result.price}
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('contact')} className="btn-primary flex-1 text-sm">
                  Получить точный расчёт
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
                <button onClick={() => setStep('form')} className="btn-outline text-sm px-4">
                  Изменить
                </button>
              </div>
              <p className="text-xs text-[#A9B1BA] text-center">
                * Предварительный расчёт. Точная цена — после подтверждения менеджером.
              </p>
            </div>
          )}

          {/* ── ШАГ 3: КОНТАКТЫ ── */}
          {step === 'contact' && (
            <div className="space-y-4">
              <p className="text-sm text-[#A9B1BA] leading-relaxed">
                Оставьте контакты — менеджер свяжется в течение часа и подтвердит точную стоимость.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mono-label text-[#A9B1BA] flex items-center gap-1 mb-2">
                    <User className="w-3 h-3" />Имя
                  </label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    placeholder="Иван Иванов"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="mono-label text-[#A9B1BA] flex items-center gap-1 mb-2">
                    <Phone className="w-3 h-3" />Телефон *
                  </label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="+996 ___ __ __ __"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="mono-label text-[#A9B1BA] flex items-center gap-1 mb-2">
                    <Building2 className="w-3 h-3" />Компания
                  </label>
                  <input
                    type="text"
                    value={contact.company}
                    onChange={(e) => setContact({ ...contact, company: e.target.value })}
                    placeholder="ООО ..."
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="mono-label text-[#A9B1BA] flex items-center gap-1 mb-2">
                    <Mail className="w-3 h-3" />Email
                  </label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="email@company.com"
                    className="input-field text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="mono-label text-[#A9B1BA] flex items-center gap-1 mb-2">
                  <FileText className="w-3 h-3" />Примечание
                </label>
                <textarea
                  value={contact.note}
                  onChange={(e) => setContact({ ...contact, note: e.target.value })}
                  placeholder="Тип груза, особые условия..."
                  className="input-field text-sm resize-none"
                  rows={2}
                />
              </div>
              <button
                onClick={handleSendRequest}
                disabled={!contact.phone.trim()}
                className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Отправить заявку
              </button>
              <p className="text-xs text-[#A9B1BA] text-center">* Обязательно только телефон</p>
            </div>
          )}

          {/* ── ШАГ 4: УСПЕХ ── */}
          {step === 'success' && (
            <div className="py-10 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#4A90A4]/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-[#4A90A4]" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-[#F4F6F8] text-lg mb-2">Заявка отправлена!</h4>
                <p className="text-sm text-[#A9B1BA] leading-relaxed">
                  Менеджер свяжется с вами в течение часа<br />
                  и подтвердит точную стоимость доставки.
                </p>
              </div>
              <button onClick={closeModal} className="btn-outline text-sm">
                Закрыть
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  ) : null;

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

        <button onClick={openModal} className="btn-primary w-full text-sm">
          Рассчитать
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Модальное окно рендерится в document.body через portal */}
      {createPortal(modal, document.body)}
    </>
  );
};

export default Calculator;

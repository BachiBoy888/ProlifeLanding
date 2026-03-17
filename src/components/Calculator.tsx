import { useState } from 'react';
import { Calculator as CalcIcon, Package, ArrowRight, MessageCircle, X } from 'lucide-react';

interface CalculatorResult {
  price: number;
  days: number;
  billableWeight: number;
}

const Calculator = () => {
  const [weight, setWeight] = useState('');
  const [volume, setVolume] = useState('');
  const [cargoType, setCargoType] = useState('general');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const calculatePrice = () => {
    const w = parseFloat(weight) || 0;
    const v = parseFloat(volume) || 0;
    
    // Calculate billable weight (max of actual weight and volumetric weight)
    const volumetricWeight = v * 167; // Standard volumetric factor
    const billableWeight = Math.max(w, volumetricWeight);
    
    // Base rate per kg depends on cargo type
    const baseRates: Record<string, number> = {
      general: 3.5,
      fragile: 4.5,
      electronics: 5.0,
      oversized: 6.0,
    };
    
    const baseRate = baseRates[cargoType] || 3.5;
    const price = Math.round(billableWeight * baseRate);
    
    // Delivery days depend on cargo type
    const deliveryDays: Record<string, number> = {
      general: 12,
      fragile: 14,
      electronics: 12,
      oversized: 18,
    };
    
    setResult({
      price,
      days: deliveryDays[cargoType] || 12,
      billableWeight: Math.round(billableWeight * 10) / 10,
    });
    setShowResult(true);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setResult(null);
  };

  return (
    <div className="panel-glass rounded-lg p-5 lg:p-6">
      {!showResult ? (
        <>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-md bg-[#4A90A4]/20 flex items-center justify-center">
              <CalcIcon className="w-5 h-5 text-[#4A90A4]" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-[#F4F6F8]">Расчёт стоимости</h3>
              <p className="text-xs text-[#A9B1BA]">Узнайте цену за 10 секунд</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="mono-label text-[#A9B1BA] block mb-2">Вес (кг)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0"
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="mono-label text-[#A9B1BA] block mb-2">Объём (м³)</label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="0"
                className="input-field text-sm"
                step="0.01"
              />
            </div>
            <div>
              <label className="mono-label text-[#A9B1BA] block mb-2">Тип груза</label>
              <select
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value)}
                className="input-field text-sm appearance-none cursor-pointer"
              >
                <option value="general">Обычный</option>
                <option value="fragile">Хрупкий</option>
                <option value="electronics">Электроника</option>
                <option value="oversized">Негабарит</option>
              </select>
            </div>
          </div>

          <button
            onClick={calculatePrice}
            disabled={!weight && !volume}
            className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Рассчитать
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </>
      ) : (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#4A90A4]/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-[#4A90A4]" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-[#F4F6F8]">Результат расчёта</h3>
                <p className="text-xs text-[#A9B1BA]">Примерная стоимость</p>
              </div>
            </div>
            <button
              onClick={resetCalculator}
              className="p-2 text-[#A9B1BA] hover:text-[#F4F6F8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-[#0B0C10] rounded-md p-3 text-center">
              <p className="mono-label text-[#A9B1BA] mb-1">Стоимость</p>
              <p className="font-display font-bold text-xl text-[#4A90A4]">${result?.price}</p>
            </div>
            <div className="bg-[#0B0C10] rounded-md p-3 text-center">
              <p className="mono-label text-[#A9B1BA] mb-1">Срок</p>
              <p className="font-display font-bold text-xl text-[#F4F6F8]">{result?.days} дн</p>
            </div>
            <div className="bg-[#0B0C10] rounded-md p-3 text-center">
              <p className="mono-label text-[#A9B1BA] mb-1">Вес</p>
              <p className="font-display font-bold text-xl text-[#F4F6F8]">{result?.billableWeight} кг</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://api.whatsapp.com/send?phone=996990111125&text="
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 text-sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Получить точный расчёт
            </a>
            <button
              onClick={resetCalculator}
              className="btn-outline text-sm"
            >
              <CalcIcon className="w-4 h-4 mr-2" />
              Новый расчёт
            </button>
          </div>

          <p className="text-xs text-[#A9B1BA] mt-4 text-center">
            * Точная стоимость зависит от характеристик груза и текущих тарифов
          </p>
        </div>
      )}
    </div>
  );
};

export default Calculator;

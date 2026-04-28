import { useMemo, useState } from 'react';
import { Wallet } from 'lucide-react';
import { type Book } from '../types';

const MONTH_LABELS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const DEMO_BASELINE_TOTAL = 63100; // Golden State demo verilerin güncel toplam geliri
const BASELINE_REVENUE: Record<string, number> = {
  Eki: 6100, Kas: 7500, Ara: 8800, Oca: 9500, Şub: 8200, Mar: 7400,
  Nis: 11200, May: 10500, Haz: 9800, Tem: 9200, Ağu: 8500, Eyl: 7800,
};

const getMonthLabel = (date: Date) => MONTH_LABELS[date.getMonth()];

const buildMonthRange = (start: Date, end: Date) => {
  const months: Date[] = [];
  const current = new Date(start.getFullYear(), start.getMonth(), 1);
  while (current <= end) {
    months.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }
  return months;
};

const getChartData = (books: Book[]) => {
  const now = new Date();
  const startYear = now.getMonth() >= 9 ? now.getFullYear() : now.getFullYear() - 1;
  const startDate = new Date(startYear, 9, 1);
  const months = buildMonthRange(startDate, new Date(now.getFullYear(), now.getMonth(), 1));

  const currentTotalRevenue = books.reduce((sum, book) => sum + book.salesCount * book.price, 0);
  const deltaRevenue = currentTotalRevenue - DEMO_BASELINE_TOTAL;
  const currentIndex = months.length - 1;

  const monthValues = months.map(date => {
    const label = getMonthLabel(date);
    return BASELINE_REVENUE[label] ?? 18000;
  });

  if (deltaRevenue >= 0) {
    monthValues[currentIndex] += deltaRevenue;
  } else {
    let remaining = -deltaRevenue;
    for (let index = currentIndex; index >= 0 && remaining > 0; index -= 1) {
      const reduction = Math.min(monthValues[index], remaining);
      monthValues[index] -= reduction;
      remaining -= reduction;
    }
  }

  return months.map((date, index) => {
    const label = getMonthLabel(date);
    return {
      label,
      value: Math.max(0, Math.round(monthValues[index])),
      isCurrent: index === currentIndex,
    };
  });
};

const normalizePoints = (values: number[]) => {
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;

  return values.map((value, index) => {
    const x = values.length === 1 ? 50 : 5 + (index / (values.length - 1)) * 90;
    const y = 85 - ((value - minValue) / range) * 70;
    return { x, y };
  });
};

const buildPath = (points: Array<{ x: number; y: number }>) => points.map(point => `${point.x},${point.y}`).join(' ');

export default function RevenueChart({ books }: { books: Book[] }) {
  const chartData = useMemo(() => getChartData(books), [books]);
  const totalRevenue = books.reduce((sum, book) => sum + book.salesCount * book.price, 0);
  const currentMonth = chartData.find(item => item.isCurrent) ?? chartData[chartData.length - 1];
  const labels = chartData.map(item => item.label);
  const values = chartData.map(item => item.value);
  const points = normalizePoints(values);
  const pathPoints = buildPath(points);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const hoverPoint = hoverIndex !== null ? points[hoverIndex] : null;
  const hoverData = hoverIndex !== null ? chartData[hoverIndex] : null;

  return (
    <div className="revenue-chart-card">
      <div className="panel-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Wallet size={20} />
          <div>
            <h3 className="panel-title">Aylık Toplam Kazanç</h3>
            
          </div>
        </div>
        <div className="revenue-summary-chip">{new Date().getFullYear()} · {currentMonth.label}</div>
      </div>

      <div className="revenue-summary-grid revenue-summary-grid--compact">
        <div className="revenue-summary-item">
          <span>Toplam Gelir</span>
          <strong>₺{totalRevenue.toLocaleString('tr-TR')}</strong>
        </div>
        <div className="revenue-summary-item">
          <span>{currentMonth.label} Ayı</span>
          <strong>₺{currentMonth.value.toLocaleString('tr-TR')}</strong>
        </div>
      </div>

      <div className="revenue-line-chart">
        <div className="revenue-line-chart-inner">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="revenue-line-svg">
            <g className="revenue-line-grid">
              <line x1="0" y1="15" x2="100" y2="15" />
              <line x1="0" y1="38.3" x2="100" y2="38.3" />
              <line x1="0" y1="61.6" x2="100" y2="61.6" />
              <line x1="0" y1="85" x2="100" y2="85" />
            </g>
            
            {/* ÇİZGİ: Farenin etkileşimini kestik ki hover bozulmasın */}
            <polyline points={pathPoints} className="revenue-line-path" style={{ pointerEvents: 'none' }} />
            
            {points.map((point, index) => {
              const isCurrent = chartData[index]?.isCurrent;
              return (
                <g key={labels[index]}>
                  {/* GÖRÜNEN NOKTA: Farenin etkileşimini kestik */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isCurrent ? 3.5 : 2.6}
                    className={`revenue-line-point ${isCurrent ? 'revenue-line-point--current' : ''}`}
                    style={{ pointerEvents: 'none' }}
                  />
                  
                  {/* GÖRÜNMEZ HOVER YUVARLAĞI: Farenin sadece burayla etkileşime girmesini sağladık */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={8}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  />
                </g>
              );
            })}
          </svg>

          {hoverPoint && hoverData && (
            <div
              className="revenue-tooltip"
              style={{ left: `${hoverPoint.x}%`, top: `${hoverPoint.y}%` }}
            >
              <div className="revenue-tooltip-label">{hoverData.label} Ayı</div>
              <div className="revenue-tooltip-value">₺{hoverData.value.toLocaleString('tr-TR')}</div>
            </div>
          )}
        </div>

        <div className="revenue-line-labels" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
          {labels.map(label => (
            <span key={label} className="revenue-line-label">{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
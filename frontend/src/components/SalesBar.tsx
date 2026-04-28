import { Flame, TrendingUp } from 'lucide-react';

export default function SalesBar({ count }: { count: number }) {
  const isHot = count > 100;
  const progress = Math.min(count / 2, 100);

  return (
    <div className="sales-bar">
      <div className="sales-bar-track">
        <div className={`sales-bar-fill ${isHot ? 'hot' : 'normal'}`} style={{ width: `${progress}%` }} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', color: isHot ? 'var(--danger)' : 'var(--secondary-color)' }}>
        {count} {isHot ? <Flame size={14} /> : <TrendingUp size={14} />}
      </span>
    </div>
  );
}

import { useState, useEffect } from 'react';
import ItemIcon from './ItemIcon';
import { ITEMS } from '@/lib/gameData';

const BAG_OPEN = `${import.meta.env.BASE_URL}images/303b1bbcf_.png`;
const BAG_CLOSED = `${import.meta.env.BASE_URL}images/96fb18caa_.png`;

const ITEM_DUR = 0.5; // seconds per item
const RING_R = 15; // vw – keeps items outside the bag image

export default function PackingAnimation({ selectedIds, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [bagClosed, setBagClosed] = useState(false);
  const items = selectedIds.map(id => ITEMS.find(i => i.id === id)).filter(Boolean);
  const n = items.length;

  useEffect(() => {
    if (n === 0) { onComplete(); return; }
    const totalItemsTime = n * ITEM_DUR * 1000;
    const adv = setInterval(() => {
      setCurrentIdx(i => {
        const next = i + 1;
        if (next >= n) { clearInterval(adv); return n; }
        return next;
      });
    }, ITEM_DUR * 1000);
    const tClose = setTimeout(() => setBagClosed(true), totalItemsTime + 200);
    const tDone = setTimeout(() => onComplete(), totalItemsTime + 800);
    return () => { clearInterval(adv); clearTimeout(tClose); clearTimeout(tDone); };
  }, [n, onComplete]);

  const posFor = (idx) => {
    const angle = n > 1 ? (idx / n) * 2 * Math.PI - Math.PI / 2 : 0;
    return {
      x: `${(Math.cos(angle) * RING_R).toFixed(1)}vw`,
      y: `${(Math.sin(angle) * RING_R).toFixed(1)}vw`,
    };
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-popin" dir="rtl"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="relative flex items-center justify-center"
        style={{ width: 'clamp(240px, 36vw, 560px)', height: 'clamp(240px, 36vw, 560px)' }}>
        <img src={bagClosed ? BAG_CLOSED : BAG_OPEN} alt="תיק ציוד"
          className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 ease-out"
          style={{ transform: bagClosed ? 'scale(1.05) rotate(-3deg)' : 'scale(1) rotate(0deg)' }} />
        {!bagClosed && items.map((item, idx) => {
          const p = posFor(idx);
          const isAnimating = idx === currentIdx;
          const isDone = idx < currentIdx;
          return (
            <div key={item.id} className="absolute"
              style={{
                left: '50%', top: '50%',
                width: 'clamp(44px, 5.5vw, 76px)', height: 'clamp(44px, 5.5vw, 76px)',
                ['--start-x']: p.x,
                ['--start-y']: p.y,
                transform: `translate(-50%, -50%) translate(${p.x}, ${p.y}) scale(2)`,
                opacity: isDone ? 0 : 1,
                animation: isAnimating ? `packJump ${ITEM_DUR}s ease-in forwards` : 'none',
                transition: 'opacity 0.2s',
              }}>
              <ItemIcon id={item.id} className="w-full h-full" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
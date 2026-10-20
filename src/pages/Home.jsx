import { useState, useRef, useEffect, useCallback } from 'react';
import { ITEMS } from '@/lib/gameData';
import SoldierFigure from '@/components/game/SoldierFigure';
import OpeningPopup from '@/components/game/OpeningPopup';
import SummaryScreen from '@/components/game/SummaryScreen';
import PackingAnimation from '@/components/game/PackingAnimation';
import ItemIcon from '@/components/game/ItemIcon';
import { Maximize, Minimize, ChevronUp, ChevronDown } from 'lucide-react';

const INNER_SHADOW = 'inset 10px 10px 20px 0px rgba(0,0,0,0.25)';
const LOGO = `${import.meta.env.BASE_URL}images/83ea21c33_INRI-LOGO.svg`;
const HOME_BTN = `${import.meta.env.BASE_URL}images/5d2d4d14b_home-btn.png`;

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Home() {
  const [phase, setPhase] = useState('opening');
  const [selectedItems, setSelectedItems] = useState([]);
  const [wearingItems, setWearingItems] = useState([]);
  const [leavingItems, setLeavingItems] = useState(new Set());
  const [shakingItems, setShakingItems] = useState(new Set());
  const [wrongTooltip, setWrongTooltip] = useState(null);
  const [shuffledItems, setShuffledItems] = useState(() => shuffleArray(ITEMS));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeGender, setActiveGender] = useState('male');
  const [dragging, setDragging] = useState(null);
  const trayScrollRef = useRef(null);
  const pendingDragRef = useRef(null);
  const draggingRef = useRef(null);
  const figureAreaRef = useRef(null);

  const startDrag = useCallback((itemId, fromZone, e) => {
    if (phase !== 'playing') return;
    e.preventDefault();
    pendingDragRef.current = { itemId, startX: e.clientX, startY: e.clientY };
  }, [phase]);

  const handleDrop = useCallback((itemId) => {
    const item = ITEMS.find(i => i.id === itemId);
    if (!item) return;
    setWearingItems(prev => prev.some(w => w.itemId === itemId) ? prev : [...prev, { itemId }]);
    if (!item.correct) {
      setShakingItems(prev => new Set(prev).add(itemId));
      setWrongTooltip({ itemId });
      setTimeout(() => {
        setShakingItems(prev => { const n = new Set(prev); n.delete(itemId); return n; });
        setWrongTooltip(t => (t && t.itemId === itemId ? null : t));
      }, 2000);
    }
    setTimeout(() => setLeavingItems(prev => new Set(prev).add(itemId)), 1700);
    setTimeout(() => {
      setWearingItems(prev => prev.filter(w => w.itemId !== itemId));
      setLeavingItems(prev => { const n = new Set(prev); n.delete(itemId); return n; });
      setSelectedItems(prev => prev.includes(itemId) ? prev : [...prev, itemId]);
    }, 2000);
  }, []);

  const isOverFigure = (x, y) => {
    const el = figureAreaRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const placedIds = new Set([...selectedItems, ...wearingItems.map(w => w.itemId)]);

  useEffect(() => { draggingRef.current = dragging; }, [dragging]);

  useEffect(() => {
    const move = (e) => {
      const d = draggingRef.current;
      if (d) {
        e.preventDefault();
        setDragging(dr => dr ? { ...dr, x: e.clientX, y: e.clientY } : dr);
        return;
      }
      const p = pendingDragRef.current;
      if (p) {
        const dx = Math.abs(e.clientX - p.startX);
        const dy = Math.abs(e.clientY - p.startY);
        if (dx > 8 && dx > dy) {
          setDragging({ itemId: p.itemId, x: e.clientX, y: e.clientY });
          pendingDragRef.current = null;
        } else if (dy > 12) {
          pendingDragRef.current = null;
        }
      }
    };
    const up = (e) => {
      const d = draggingRef.current;
      if (d) {
        if (isOverFigure(e.clientX, e.clientY)) handleDrop(d.itemId);
      } else if (pendingDragRef.current) {
        handleDrop(pendingDragRef.current.itemId);
      }
      pendingDragRef.current = null;
      setDragging(null);
    };
    const cancel = () => { pendingDragRef.current = null; setDragging(null); };
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTray = (dir) => {
    const el = trayScrollRef.current;
    if (!el) return;
    const first = el.firstElementChild;
    const step = first ? first.offsetHeight + 8 : el.clientHeight * 0.8;
    el.scrollBy({ top: dir * step, behavior: 'smooth' });
  };

  const handleCheck = () => { if (selectedItems.length === 0) return; setPhase('packing'); };
  const correctChoices = selectedItems.filter(id => ITEMS.find(i => i.id === id)?.correct);
  const score = correctChoices.length;
  const mistakes = selectedItems.length - score;

  const reset = () => {
    setSelectedItems([]);
    setWearingItems([]);
    setLeavingItems(new Set());
    setShakingItems(new Set());
    setWrongTooltip(null);
    setShuffledItems(shuffleArray(ITEMS));
    setPhase('playing');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const onNavigateHome = () => { window.location.href = 'https://inri-pkrf.github.io/Totem-Pro-Final/'; };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center overflow-x-hidden"
      style={{ fontFamily: "'Heebo', sans-serif", background: 'linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)', padding: 'clamp(8px, 2vw, 24px)' }}>

      {/* Header */}
      <header className="totem-header relative w-full flex items-center justify-center mb-[0.5vh]"
        style={{ minHeight: 'clamp(40px, 5vh, 80px)' }}>
        <img src={LOGO} alt="המכללה הלאומית לאיתנות ישראלית"
          className="absolute object-contain"
          style={{ top: 0, right: 0, height: 'clamp(34px, 5vh, 64px)' }} />
        <h1 className="font-karantina text-[#1A2F5A] text-center leading-none"
          style={{ fontSize: 'var(--title-size)', padding: '0 clamp(70px, 8vw, 150px)' }}>
          איזה ציוד לוקחים לאתר הרס?
        </h1>
      </header>

      {/* Central white container */}
      <div className="relative flex flex-col lg:flex-row-reverse items-stretch"
        style={{ width: '100%', maxWidth: '1600px', minHeight: 'var(--container-min-h)', background: 'transparent', padding: 'clamp(12px, 2vw, 32px)' }}>

        {/* Soldier area */}
        <div className="soldier-area relative flex-1 flex flex-col items-center justify-center min-h-0 min-w-0 gap-2">
          <div ref={figureAreaRef} className="figure-area flex-1 flex items-center justify-center min-h-0 min-w-0 w-full">
            <div className="w-full min-w-0 flex items-center justify-center">
              <SoldierFigure
                wornItems={wearingItems}
                leavingItems={leavingItems}
                shakingItems={shakingItems}
                phase={phase}
                activeGender={activeGender}
                onSwitchGender={() => setActiveGender(g => g === 'male' ? 'female' : 'male')}
              />
            </div>
          </div>
        </div>

        {/* Equipment menu */}
        <div className="flex flex-col items-center justify-center shrink-0"
          style={{ width: 'clamp(180px, 22vw, 300px)', gap: 'clamp(8px, 2vh, 20px)', '--circle-size': 'clamp(100px, 12vw, 190px)', '--arrow-size': 'clamp(48px, 6vw, 80px)', '--item-label-size': 'clamp(16px, 2vw, 26px)' }}>
          <button onClick={() => scrollTray(-1)} disabled={phase !== 'playing'}
            className="text-[#1A2F5A] hover:scale-110 active:scale-95 transition-transform disabled:opacity-20"
            style={{ touchAction: 'manipulation' }}>
            <ChevronUp style={{ width: 'var(--arrow-size)', height: 'var(--arrow-size)' }} />
          </button>

          <div ref={trayScrollRef} className="tray-scroll flex flex-col items-center"
            style={{ gap: 'clamp(12px, 2.4vh, 28px)', maxHeight: 'clamp(600px, 112vh, 1440px)', overflowY: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', padding: '14px 10px' }}>
            {shuffledItems.map(item => {
              const placed = placedIds.has(item.id);
              return (
                <div key={item.id} className="flex flex-col items-center shrink-0" style={{ gap: '6px', overflow: 'visible' }}>
                  <button
                    onPointerDown={(e) => { if (!placed && phase === 'playing') startDrag(item.id, null, e); }}
                    className={`relative rounded-full flex items-center justify-center transition-transform duration-200 touch-pan-y ${!placed ? 'hover:scale-105 active:scale-95' : ''}`}
                    style={{
                      width: 'var(--circle-size)', height: 'var(--circle-size)',
                      background: '#fff', borderRadius: '50%',
                      boxShadow: INNER_SHADOW,
                      opacity: placed ? 0.4 : 1,
                      cursor: placed ? 'not-allowed' : 'grab',
                    }}
                  >
                    <ItemIcon id={item.id} className="w-[62%] h-[62%]" />
                    {placed && (
                      <span className="absolute top-1 left-1 z-10 rounded-full bg-[#FF6B00] text-white flex items-center justify-center"
                        style={{ width: 'clamp(14px, 1.5vw, 22px)', height: 'clamp(14px, 1.5vw, 22px)', fontSize: 'clamp(8px, 1vw, 12px)' }}>✓</span>
                    )}
                  </button>
                  <span className="text-[#1A2F5A] font-bold text-center leading-tight"
                    style={{ fontSize: 'var(--item-label-size)', opacity: placed ? 0.4 : 1 }}>{item.label}</span>
                </div>
              );
            })}
          </div>

          <button onClick={() => scrollTray(1)} disabled={phase !== 'playing'}
            className="text-[#1A2F5A] hover:scale-110 active:scale-95 transition-transform disabled:opacity-20"
            style={{ touchAction: 'manipulation' }}>
            <ChevronDown style={{ width: 'var(--arrow-size)', height: 'var(--arrow-size)' }} />
          </button>
        </div>

        {/* Action buttons (bottom-left of container) */}
        <div className="fixed flex items-center z-50"
          style={{ bottom: 'clamp(10px, 1.5vw, 22px)', right: 'clamp(10px, 1.5vw, 22px)', gap: 'clamp(6px, 1vw, 14px)' }}>
          <button onClick={toggleFullscreen}
            className="rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform"
            style={{ width: 'clamp(40px, 5vw, 64px)', height: 'clamp(40px, 5vw, 64px)', background: '#1A2F5A', touchAction: 'manipulation' }}
            aria-label="מסך מלא">
            {isFullscreen ? <Minimize className="w-1/2 h-1/2" /> : <Maximize className="w-1/2 h-1/2" />}
          </button>
          <button onClick={onNavigateHome}
            className="rounded-full overflow-hidden flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            style={{ width: 'clamp(40px, 5vw, 64px)', height: 'clamp(40px, 5vw, 64px)', background: '#FF6B00', touchAction: 'manipulation' }}
            aria-label="בית">
            <img src={HOME_BTN} alt="בית" className="w-[70%] h-[70%] object-cover" />
          </button>
        </div>
      </div>

      {/* Score + Check button */}
      <div className="flex flex-col items-center mt-[2vh] mb-[1vh]">
        <div className="flex items-center gap-4 mb-2">
          <span className="font-bold text-[#22C55E]" style={{ fontSize: 'var(--counter-size)' }}>✓ {score}</span>
          <span className="font-bold text-[#EF4444]" style={{ fontSize: 'var(--counter-size)' }}>✗ {mistakes}</span>
        </div>
        <button onClick={handleCheck} disabled={selectedItems.length === 0 || phase !== 'playing'}
          className="font-karantina text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.03] active:scale-95"
          style={{
            width: 'clamp(200px, 30vw, 500px)', padding: 'clamp(10px, 1.5vh, 22px) 0',
            fontSize: 'clamp(20px, 3vw, 48px)', borderRadius: '999px',
            background: 'linear-gradient(135deg, #FF9A52 0%, #FF6B00 100%)',
            boxShadow: '0 6px 18px rgba(255,107,0,0.35)',
            touchAction: 'manipulation',
          }}>
          בדיקת הציוד
        </button>
      </div>

      {phase === 'opening' && <OpeningPopup onStart={() => setPhase('playing')} />}
      {phase === 'packing' && (
        <PackingAnimation selectedIds={selectedItems} onComplete={() => setPhase('summary')} />
      )}
      {phase === 'summary' && (
        <SummaryScreen score={score} mistakes={mistakes} selectedIds={selectedItems} onReplay={reset} />
      )}

      {wrongTooltip && (
        <div className="fixed pointer-events-none z-[80] animate-popin"
          style={{ left: '50%', top: '40%', transform: 'translate(-50%, -130%)' }}>
          <div className="bg-white border-2 border-[#EF4444] rounded-xl shadow-2xl p-3 max-w-[240px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">❌</span>
              <span className="font-black text-[#EF4444] text-sm">
                {ITEMS.find(i => i.id === wrongTooltip.itemId)?.label}
              </span>
            </div>
            <p className="text-xs text-[#1A2F5A] leading-snug">
              {ITEMS.find(i => i.id === wrongTooltip.itemId)?.explanation}
            </p>
          </div>
        </div>
      )}

      {dragging && (
        <div className="fixed pointer-events-none z-[60]" style={{ left: dragging.x, top: dragging.y, transform: 'translate(-50%,-50%)' }}>
          <div className="rounded-full bg-white border-2 border-[#FF6B00] flex items-center justify-center shadow-2xl"
            style={{ width: 'clamp(50px, 6vw, 80px)', height: 'clamp(50px, 6vw, 80px)' }}>
            <ItemIcon id={dragging.itemId} className="w-[62%] h-[62%]" />
          </div>
        </div>
      )}
    </div>
  );
}

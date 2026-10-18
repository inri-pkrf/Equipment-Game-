import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AlertTriangle, Check } from 'lucide-react';
import { ITEMS, CORRECT_COUNT } from '@/lib/gameData';
import ItemIcon from './ItemIcon';
import { playVictory, playDefeat } from '@/lib/sounds';

export default function SummaryScreen({ score, mistakes, selectedIds, onReplay }) {
  const total = CORRECT_COUNT;
  const effectiveScore = score - mistakes;
  const stars = effectiveScore >= 8 ? 3 : effectiveScore >= 5 ? 2 : effectiveScore >= 2 ? 1 : 0;
  const isVictory = stars >= 2;
  const message = stars === 3 ? 'מצוין! מוכן לכל תרחיש'
    : stars === 2 ? 'כל הכבוד! עוד קצת ושם'
    : stars === 1 ? 'התחלה טובה – כדאי לנסות שוב'
    : 'לא ויתרת – נסה שוב ותשתפר';

  useEffect(() => {
    if (isVictory) {
      playVictory();
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors: ['#FF6B00', '#FFD700', '#22C55E', '#1A2F5A'] });
      setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.7 } }), 300);
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.7 } }), 600);
    } else {
      playDefeat();
    }
  }, [isVictory]);

  const selectedSet = new Set(selectedIds);
  const missedItems = ITEMS.filter(i => i.correct && !selectedSet.has(i.id));
  const selectedCorrectItems = ITEMS.filter(i => i.correct && selectedSet.has(i.id));
  const correctPlaced = selectedIds.filter(id => ITEMS.find(i => i.id === id)?.correct).length;
  const wrongPlaced = selectedIds.filter(id => !ITEMS.find(i => i.id === id)?.correct).length;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 md:p-6" dir="rtl"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="bg-white rounded-3xl p-4 md:p-6 w-full max-w-[820px] text-right animate-popin"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

        {/* כותרת */}
        <div className="text-center mb-3">
          <h2 className="text-xl md:text-2xl font-black text-[#1A2F5A] flex items-center justify-center gap-2 mb-1">
            <span>🛡️</span> סיכום הציוד שלך
          </h2>
          <div className="flex items-center justify-center gap-1 mb-1">
            {[0, 1, 2].map(i => (
              <span key={i} className={`text-2xl md:text-3xl transition-all duration-500 ${i < stars ? 'text-[#FFD700] scale-110' : 'text-[#1A2F5A]/20'}`}>★</span>
            ))}
          </div>
          <p className="text-base md:text-lg font-black text-[#FF6B00]">{score} מתוך {total} ציוד נכון</p>
          <p className="text-xs text-[#1A2F5A]/70">
            {correctPlaced} נכונים ✓ | {wrongPlaced} טעויות ✗
          </p>
          <p className="text-[11px] text-[#1A2F5A]/50">{message}</p>
        </div>

        {/* פריטים שחייבים לקחת ולא נבחרו */}
        <div className="rounded-2xl p-3 mb-3" style={{ background: '#FFF5E6' }}>
          <h3 className="font-black text-[#F97316] mb-2 text-sm md:text-base flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> פריטים שחייבים לקחת לאתר הרס ולא נבחרו
          </h3>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(118px, 1fr))' }}>
            {missedItems.map(item => (
              <div key={item.id} className="rounded-xl p-2 flex flex-col items-center text-center transition-all animate-popin"
                style={{ border: '3px dashed #F97316', background: '#fff' }}>
                <ItemIcon id={item.id} className="w-8 h-8" />
                <span className="font-bold text-[#1A2F5A] text-xs leading-tight mt-0.5">{item.label}</span>
                <span className="text-[11px] text-[#1A2F5A]/80 leading-tight mt-0.5">{item.explanation}</span>
                <span className="text-[10px] font-bold text-[#F97316] mt-0.5">⚠ חסר – חובה לקחת!</span>
              </div>
            ))}
          </div>
        </div>

        {/* פריטים שחייבים לקחת ונבחרו */}
        {selectedCorrectItems.length > 0 && (
        <div className="rounded-2xl p-3 mb-4" style={{ background: '#F0FFF4' }}>
          <h3 className="font-black text-[#22C55E] mb-2 text-sm md:text-base flex items-center gap-1">
            <Check className="w-4 h-4" /> פריטים שחייבים לקחת לאתר הרס ונבחרו
          </h3>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(118px, 1fr))' }}>
            {selectedCorrectItems.map(item => (
              <div key={item.id} className="rounded-xl p-2 flex flex-col items-center text-center transition-all animate-popin"
                style={{ border: '2px solid #22C55E', background: '#fff' }}>
                <ItemIcon id={item.id} className="w-8 h-8" />
                <span className="font-bold text-[#1A2F5A] text-xs leading-tight mt-0.5">{item.label}</span>
                <span className="text-[11px] text-[#1A2F5A]/80 leading-tight mt-0.5">{item.explanation}</span>
                <span className="text-[10px] font-bold text-[#22C55E] mt-0.5">נבחר נכון ✓</span>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* כפתור שחק שוב */}
        <div className="flex justify-center">
          <button onClick={onReplay}
            className="px-8 py-3 rounded-2xl bg-[#FF6B00] text-white text-lg font-black shadow-lg hover:scale-105 active:scale-95 transition-transform">
            🔄 שחקו שוב
          </button>
        </div>
      </div>
    </div>
  );
}
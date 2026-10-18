import { useState } from 'react';
import ItemIcon from './ItemIcon';
import { ANCHORS } from '@/lib/gameData';

const MALE_IMG = `${import.meta.env.BASE_URL}images/836f8e0ca_.png`;
const FEMALE_IMG = `${import.meta.env.BASE_URL}images/7a3d56495_.png`;

export default function SoldierFigure({ wornItems, leavingItems, shakingItems, phase, activeGender, onSwitchGender }) {
  const maleActive = activeGender === 'male';
  const [aspects, setAspects] = useState({ male: 1.1, female: 1.1 });

  const onImgLoad = (gender) => (e) => {
    const w = e.target.naturalWidth;
    const h = e.target.naturalHeight;
    if (w && h) setAspects(a => ({ ...a, [gender]: (w / 0.6) / h }));
  };

  // במובייל: גובה לפי aspectRatio (מרווח מוגדר); ב-lg/TOTEM: h-full ממלא את גובה התפריט (stretch).
  const aspect = (maleActive ? aspects.male : aspects.female) || 1.1;

  const renderFigure = (gender, isActive) => {
    const img = gender === 'male' ? MALE_IMG : FEMALE_IMG;
    return (
      <div
        className="absolute transition-all duration-500 ease-in-out"
        style={{
          // הדמות הפעילה: ממלאת את כל הגובה, והרוחב נגזר מהיחס של התמונה (כמו קודם: 70% מהמיכל)
          // הדמות הלא פעילה: קטנה, צמודה לשמאל וכולה בתוך המסך
          width: 'auto',
          aspectRatio: isActive ? `${aspect * 0.7}` : 'auto',
          height: isActive ? '100%' : '36%',
          left: isActive ? '50%' : '0%',
          top: isActive ? '50%' : '98%',
          transform: isActive ? 'translate(-50%, -50%)' : 'translate(0, -100%)',
          pointerEvents: isActive ? 'none' : 'auto',
          zIndex: isActive ? 3 : 2,
          opacity: isActive ? 1 : 0.5,
          filter: 'none',
          cursor: !isActive && phase === 'playing' ? 'pointer' : 'default',
        }}
        onClick={() => { if (!isActive && phase === 'playing') onSwitchGender(); }}
      >
        {isActive ? (
          <div
            className="relative h-full flex items-center justify-center transition-all duration-500 ease-in-out"
            style={{
              overflow: 'visible',
              background: 'transparent',
              boxShadow: 'none',
            }}
          >
            <img src={img} alt={gender === 'male' ? 'חייל' : 'חיילת'}
              className="h-full w-auto block select-none" draggable={false}
              onLoad={onImgLoad(gender)} />

            {wornItems.map(w => {
              const anchor = ANCHORS[w.itemId] || { top: '55%', left: '30%', w: '40%' };
              const leaving = leavingItems.has(w.itemId);
              const shaking = shakingItems.has(w.itemId);
              return (
                <div key={w.itemId}
                  className={`absolute flex items-center justify-center transition-opacity duration-300 ${shaking ? 'animate-shake-loop' : ''}`}
                  style={{ top: anchor.top, left: anchor.left, width: anchor.w, opacity: leaving ? 0 : 1 }}>
                  <ItemIcon id={w.itemId} className="w-[calc(var(--selected-icon-size)*4)] h-[calc(var(--selected-icon-size)*4)]" />
                </div>
              );
            })}
          </div>
        ) : (
          <img src={img} alt="חיילת"
            className="h-full w-auto block select-none" draggable={false}
            onLoad={onImgLoad(gender)} />
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full mx-auto select-none h-full" style={{ aspectRatio: `${aspect}`, height: 'var(--soldier-h)', maxWidth: 'var(--soldier-max-w)' }}>
      {renderFigure('male', maleActive)}
      {renderFigure('female', !maleActive)}
    </div>
  );
}
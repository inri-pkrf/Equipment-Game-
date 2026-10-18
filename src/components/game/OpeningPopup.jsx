import { useEffect } from 'react';
import { playAlarm } from '@/lib/sounds';

const enterFullscreen = () => {
  const elem = document.documentElement;
  try {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } catch (err) {
    console.warn('Fullscreen request failed:', err);
  }
};

export default function OpeningPopup({ onStart }) {
  useEffect(() => {
    playAlarm();
  }, []);

  const handleStart = () => {
    enterFullscreen();
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2F5A]/95 p-4" dir="rtl">
      <div className="relative max-w-lg w-full bg-[#EDEAE3] rounded-3xl border-4 border-[#FF6B00] p-6 2xl:p-10 text-center animate-popin shadow-2xl">
        {/* בניין מתמוטט */}
        <div className="relative h-32 2xl:h-44 mb-4 flex items-end justify-center">
          <div className="absolute bottom-0 animate-collapse">
            <svg viewBox="0 0 200 160" className="w-32 2xl:w-44 h-auto">
              <rect x="60" y="40" width="80" height="110" fill="#1A2F5A" />
              <rect x="70" y="55" width="14" height="14" fill="#FFD700" />
              <rect x="93" y="55" width="14" height="14" fill="#FFD700" />
              <rect x="116" y="55" width="14" height="14" fill="#FFD700" />
              <rect x="70" y="80" width="14" height="14" fill="#FF6B00" />
              <rect x="93" y="80" width="14" height="14" fill="#FF6B00" />
              <rect x="116" y="80" width="14" height="14" fill="#FF6B00" />
              <rect x="70" y="105" width="14" height="14" fill="#FFD700" />
              <rect x="116" y="105" width="14" height="14" fill="#FFD700" />
              <rect x="88" y="120" width="24" height="30" fill="#1A2F5A" />
              {/* סדקים */}
              <path d="M100 40 L96 70 L104 90 L98 130" stroke="#EDEAE3" strokeWidth="2" fill="none" />
            </svg>
          </div>
          {/* אבק */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute bottom-8 rounded-full bg-[#FFD700]/70 animate-dust"
              style={{
                left: `${30 + i * 8}%`, width: `${10 + i * 3}px`, height: `${10 + i * 3}px`,
                animationDelay: `${i * 0.2}s`, animationDuration: `${1.4 + i * 0.15}s`,
              }} />
          ))}
        </div>

        <h1 className="text-2xl 2xl:text-4xl font-black text-[#1A2F5A] leading-tight mb-2">
          אירוע הרס!
        </h1>
        <p className="text-base 2xl:text-xl font-bold text-[#FF6B00] mb-3">
          בניין קרס – נדרשת התערבות מיידית של פיקוד העורף
        </p>
        <p className="text-lg 2xl:text-2xl font-black text-[#1A2F5A] mb-6">מה תקחו לאתר?</p>

        <button
          onClick={handleStart}
          className="w-full py-4 2xl:py-5 rounded-2xl bg-[#FF6B00] text-white text-xl 2xl:text-2xl font-black shadow-lg hover:scale-[1.03] active:scale-95 transition-transform"
        >
          בואו נתחיל!
        </button>
      </div>
    </div>
  );
}
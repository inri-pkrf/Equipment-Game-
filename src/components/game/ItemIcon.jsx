import { ITEMS } from '@/lib/gameData';

const IMG_MAP = Object.fromEntries(ITEMS.map(i => [i.id, i.image]));

export default function ItemIcon({ id, className = 'w-10 h-10' }) {
  const src = IMG_MAP[id];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={id}
      className={className}
      style={{ objectFit: 'contain', pointerEvents: 'none' }}
      draggable={false}
    />
  );
}
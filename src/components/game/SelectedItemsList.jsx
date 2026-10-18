import ItemIcon from './ItemIcon';

export default function SelectedItemsList({ items }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 min-h-[44px] max-w-full" dir="rtl">
      {items.map(id => (
        <div key={id} className="animate-popin rounded-lg bg-white border-2 border-[#1A2F5A] flex items-center justify-center shadow"
          style={{ width: 'var(--selected-icon-size)', height: 'var(--selected-icon-size)' }}>
          <ItemIcon id={id} className="w-[70%] h-[70%]" />
        </div>
      ))}
    </div>
  );
}
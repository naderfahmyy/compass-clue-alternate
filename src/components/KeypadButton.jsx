export default function KeypadButton({ value, isActive, onPress }) {
  return (
    <button
      onClick={() => onPress(value)}
      className={`w-20 h-20 text-2xl font-extrabold border-2 border-gray-400 text-gray-200 
        rounded-md transition-transform bg-neutral-800/70
        ${isActive ? "bg-gray-500 scale-95" : ""}
        active:scale-95`}
    >
      {value}
    </button>
  );
}

export default function Light({ isOn, color }) {
  const domeColors = {
    red: isOn
      ? "bg-gradient-to-b from-red-500 to-red-800"
      : "bg-gradient-to-b from-red-900 to-red-950",
    green: isOn
      ? "bg-gradient-to-b from-green-500 to-green-800"
      : "bg-gradient-to-b from-green-900 to-green-950",
  };

  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <div
        className={`w-full h-full rounded-full ${domeColors[color]} transition-colors`}
      />
      <div
        className={`absolute rounded-full w-[170%] h-[170%] blur-md transition-opacity
          ${color === "red" ? "bg-red-500" : "bg-green-500"}
          ${isOn ? "opacity-60" : "opacity-0"}`}
      />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),transparent_70%)]" />
      <div className="absolute top-[18%] left-[20%] w-1.5 h-1.5 bg-white rounded-full opacity-40 blur-[1px]" />
    </div>
  );
}

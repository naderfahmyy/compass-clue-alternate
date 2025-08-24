export default function PreviewDisplay({ entered }) {
  return (
    <div className="flex gap-4 text-gray-200 text-2xl font-mono">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="relative w-5 flex justify-center">
          {entered[i] && <span className="absolute -top-1">{entered[i]}</span>}
          <span className="text-gray-400">_</span>
        </div>
      ))}
    </div>
  );
}

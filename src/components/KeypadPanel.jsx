import Light from "./Light";
import PreviewDisplay from "./PreviewDisplay";
import Keypad from "./Keypad";

export default function KeypadPanel({
  redOn,
  greenOn,
  entered,
  onKeyPress,
  pressedKey,
}) {
  return (
    <div className="relative z-10 p-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border-4 border-neutral-600 shadow-[0_8px_25px_rgba(0,0,0,0.6)]">
      <div className="flex flex-col gap-10">
        {/* Top row: lights and entry preview */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Light isOn={redOn} color="red" />
            <Light isOn={greenOn} color="green" />
          </div>
          <PreviewDisplay entered={entered} />
        </div>

        <Keypad onKeyPress={onKeyPress} pressedKey={pressedKey} />
      </div>
    </div>
  );
}

import { KEYPAD_ROWS } from "../constants/keypadConstants";
import KeypadButton from "./KeypadButton";

export default function Keypad({ onKeyPress, pressedKey }) {
  return (
    <div className="flex flex-col gap-4">
      {KEYPAD_ROWS.map((row, rIdx) => (
        <div key={rIdx} className="flex gap-4">
          {row.map((k) => (
            <KeypadButton
              key={k}
              value={k}
              onPress={onKeyPress}
              isActive={pressedKey === k}
            />
          ))}
        </div>
      ))}

      <div className="flex gap-4">
        <div className="w-20 h-20" />
        <div className="w-20 h-20" />
        <KeypadButton
          value="←"
          onPress={onKeyPress}
          isActive={pressedKey === "←"}
        />
      </div>
    </div>
  );
}

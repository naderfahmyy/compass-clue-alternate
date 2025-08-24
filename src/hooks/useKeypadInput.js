import { useState, useEffect } from "react";
import {
  UNLOCK_CODE,
  SEQUENCE_CODE,
  UI_TIMING,
  SEQUENCE_TIMING,
} from "../constants/keypadConstants";

/**
 * Hook to handle keypad input & code validation
 * @param {function} onUnlock - called when unlock code is correct
 * @param {function} onSequenceSuccess - called when sequence code is correct
 * @param {function} onWrongCode - called when a wrong code is entered
 */
export default function useKeypadInput(
  onUnlock,
  onSequenceSuccess,
  onWrongCode
) {
  const [entered, setEntered] = useState("");
  const [pressedKey, setPressedKey] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  /** Handle a key press (from button click or physical keyboard) */
  const handleKey = (key) => {
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150); // flash pressed state

    if (key === "←") {
      setEntered((prev) => prev.slice(0, -1)); // delete last digit
      return;
    }

    if (entered.length >= 4) return; // prevent overflow

    const newCode = entered + key;
    setEntered(newCode);

    if (newCode.length === 4) {
      checkCode(newCode);
    }
  };

  /** Validate entered code */
  const checkCode = (code) => {
    if (!unlocked) {
      // Unlock phase
      if (code === UNLOCK_CODE) {
        setUnlocked(true);
        setTimeout(() => {
          onUnlock?.();
        }, SEQUENCE_TIMING.SEQUENCE_START_DELAY);
        setTimeout(() => setEntered(""), UI_TIMING.CLEAR_PREVIEW);
      } else {
        onWrongCode?.("unlock");
        setTimeout(() => setEntered(""), UI_TIMING.CLEAR_PREVIEW);
      }
      return;
    }

    // Sequence phase
    if (code === SEQUENCE_CODE) {
      onSequenceSuccess?.();
      setTimeout(() => setEntered(""), 600);
    } else {
      onWrongCode?.("sequence");
      setTimeout(() => setEntered(""), 600);
    }
  };

  /** Allow physical keyboard presses */
  useEffect(() => {
    const handleKeyDown = (e) => {
      let key = e.key;
      if (key === "Backspace") {
        handleKey("←");
      } else {
        key = key.toUpperCase();
        if (
          ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "#"].includes(
            key
          )
        ) {
          handleKey(key);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return {
    entered,
    pressedKey,
    unlocked,
    handleKey,
  };
}

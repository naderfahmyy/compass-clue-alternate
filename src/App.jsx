import { useState, useEffect } from "react";
import KeypadPanel from "./components/KeypadPanel";
import useKeypadInput from "./hooks/useKeypadInput";
import useSequencePlayer from "./hooks/useSequencePlayer";
import {
  SEQUENCE_CODE,
  UI_TIMING,
  SEQUENCE_TIMING,
} from "./constants/keypadConstants";

export default function App() {
  const [redOn, setRedOn] = useState(false);
  const { greenOn, playSequence, stop } = useSequencePlayer(SEQUENCE_CODE);

  // Track how many times they try entering the SEQUENCE_CODE here
  const [wrongEntryCount, setWrongEntryCount] = useState(0);

  const flashRed = () => {
    setRedOn(true);
    setTimeout(() => setRedOn(false), UI_TIMING.RED_FLASH);
  };

  const { entered, pressedKey, unlocked, handleKey } = useKeypadInput(
    // 1. Correct unlock (UNLOCK_CODE)
    () => {
      playSequence();
    },
    // 2. Correct sequence (game logic)
    () => {
      stop();
    },
    // 3. Wrong code
    (phase) => {
      flashRed();
      if (phase === "sequence") {
        stop();
        setTimeout(() => {
          playSequence();
        }, SEQUENCE_TIMING.RESTART_DELAY);
      }
    },
    // 4. "Troll" case: user enters SEQUENCE_CODE here
    () => {
      setWrongEntryCount((prev) => prev + 1);
    }
  );

  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-neutral-500 via-neutral-700 to-neutral-900 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-40 mix-blend-overlay pointer-events-none" />

      {/* The troll message "Not Here" */}
      <div
        className="absolute w-screen h-screen text-white font-extrabold opacity-30 pointer-events-none select-none"
        style={{
          fontSize: `${2 + wrongEntryCount * 3}rem`, // grows bigger each time
          // transform: "translate(-50%, -50%)",
          // top: "50%",
          // left: "50%",
          zIndex: 0, // stays behind keypad
          transition: "font-size 0.5s ease-in-out",
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          APP
        </div>
      </div>

      {/* The keypad itself */}
      <KeypadPanel
        redOn={redOn}
        greenOn={greenOn}
        entered={entered}
        onKeyPress={handleKey}
        pressedKey={pressedKey}
      />
    </div>
  );
}

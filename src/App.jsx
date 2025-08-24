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

  const flashRed = () => {
    setRedOn(true);
    setTimeout(() => setRedOn(false), UI_TIMING.RED_FLASH);
  };

  const { entered, pressedKey, unlocked, handleKey } = useKeypadInput(
    () => {
      playSequence();
    },
    () => {
      stop();
    },
    (phase) => {
      flashRed();
      if (phase === "sequence") {
        stop();
        setTimeout(() => {
          playSequence();
        }, SEQUENCE_TIMING.RESTART_DELAY);
      }
    }
  );

  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-neutral-500 via-neutral-700 to-neutral-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-40 mix-blend-overlay pointer-events-none" />

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

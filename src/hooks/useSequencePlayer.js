import { useState, useRef } from "react";
import { SEQUENCE_TIMING } from "../constants/keypadConstants";

export default function useSequencePlayer(sequenceCode) {
  const [greenOn, setGreenOn] = useState(false);
  const abortRef = useRef({ abort: false, timeouts: [] });

  // Helper: clear all registered timeouts
  const clearAll = () => {
    abortRef.current.timeouts.forEach(clearTimeout);
    abortRef.current.timeouts = [];
  };

  // Helper: register timeout so we can clear later
  const addTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    abortRef.current.timeouts.push(id);
    return id;
  };

  // Flash one digit N times
  const flashDigit = (count) =>
    new Promise((resolve) => {
      let flashes = 0;

      const flash = () => {
        if (abortRef.current.abort) return resolve();

        // turn green light ON
        setGreenOn(true);

        addTimeout(() => {
          setGreenOn(false); // turn OFF
          flashes++;

          if (flashes >= count) {
            // pause before next digit
            addTimeout(resolve, SEQUENCE_TIMING.DIGIT_PAUSE);
          } else {
            // gap between flashes of the same digit
            addTimeout(flash, SEQUENCE_TIMING.FLASH_INTERVAL);
          }
        }, SEQUENCE_TIMING.FLASH_DURATION);
      };

      flash();
    });

  // Play the full code in sequence
  const playSequence = async () => {
    stop(); // in case something already running
    abortRef.current.abort = false;

    for (const digit of sequenceCode) {
      if (abortRef.current.abort) break;

      // 0 = 10 flashes, otherwise digit value, non-numeric = flash once
      const num = digit === "0" ? 10 : parseInt(digit, 10) || 1;
      await flashDigit(num);
    }
  };

  const stop = () => {
    abortRef.current.abort = true;
    clearAll();
    setGreenOn(false);
  };

  return { greenOn, playSequence, stop };
}

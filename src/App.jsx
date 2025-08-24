import { useState, useEffect, useRef } from "react";

function Light({ isOn, color }) {
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
      {/* Dome bulb */}
      <div
        className={`w-full h-full rounded-full transition-colors duration-200 ${domeColors[color]}`}
      />

      {/* Glow halo */}
      <div
        className={`absolute rounded-full w-[170%] h-[170%] blur-md transition-opacity duration-300 ease-out pointer-events-none
          ${color === "red" ? "bg-red-500" : "bg-green-500"}
          ${isOn ? "opacity-60" : "opacity-0"}`}
      />

      {/* Inner depth (radial overlay for round look) */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none 
                   bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),transparent_70%)]"
      />

      {/* Highlight spot */}
      <div className="absolute top-[18%] left-[20%] w-1.5 h-1.5 bg-white rounded-full opacity-40 blur-[1px]" />
    </div>
  );
}

export default function App() {
  const UNLOCK_CODE = "5973";
  const SEQUENCE_CODE = "4197";

  const [unlocked, setUnlocked] = useState(false);
  const [entered, setEntered] = useState("");
  const [redOn, setRedOn] = useState(false);
  const [greenOn, setGreenOn] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);

  const sequenceAbortRef = useRef({ abort: false, intervals: [] });

  // keypad layout
  const keypadRows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];

  useEffect(() => {
    if (unlocked) {
      playGreenSequence();
    }
    return () => stopGreenSequence();
  }, [unlocked]);

  const handleKey = (key) => {
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);

    if (key === "←") {
      setEntered((prev) => prev.slice(0, -1));
      return;
    }

    if (entered.length >= 4) return;

    const newEntered = entered + key;
    setEntered(newEntered);

    if (newEntered.length === 4) {
      stopGreenSequence();
      checkCode(newEntered);
    }
  };

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

  const checkCode = (code) => {
    if (!unlocked) {
      if (code === UNLOCK_CODE) {
        setUnlocked(true);
        // ✅ Delay clearing preview
        setTimeout(() => setEntered(""), 600);
      } else {
        flashRed();
        setTimeout(() => setEntered(""), 600);
      }
      return;
    }

    if (code === SEQUENCE_CODE) {
      // ✅ Delay clearing preview
      setTimeout(() => setEntered(""), 600);
    } else {
      flashRed();
      setTimeout(() => {
        setEntered("");
        playGreenSequence(); // keep this after the delay as well
      }, 600);
    }
  };

  const flashRed = () => {
    setRedOn(true);
    setTimeout(() => setRedOn(false), 400);
  };

  const flashGreen = (times) =>
    new Promise((resolve) => {
      let count = 0;
      const interval = setInterval(() => {
        if (sequenceAbortRef.current.abort) {
          clearInterval(interval);
          return resolve();
        }
        setGreenOn(true);
        setTimeout(() => setGreenOn(false), 200);
        count++;
        if (count >= times) {
          clearInterval(interval);
          setTimeout(resolve, 150);
        }
      }, 600);
      sequenceAbortRef.current.intervals.push(interval);
    });

  const playGreenSequence = async () => {
    stopGreenSequence();
    sequenceAbortRef.current.abort = false;
    for (const digit of SEQUENCE_CODE) {
      if (sequenceAbortRef.current.abort) break;
      let flashes = isNaN(digit) ? 1 : parseInt(digit, 10);
      await flashGreen(flashes);
    }
  };

  const stopGreenSequence = () => {
    sequenceAbortRef.current.abort = true;
    sequenceAbortRef.current.intervals.forEach((id) => clearInterval(id));
    sequenceAbortRef.current.intervals = [];
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center 
                    bg-gradient-to-br from-neutral-500 via-neutral-700 to-neutral-900
                    relative overflow-hidden"
    >
      {/* Brushed steel texture overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-40 mix-blend-overlay pointer-events-none" />

      {/* Mounted Keypad Panel */}
      <div
        className="relative z-10 p-10 rounded-xl 
                      bg-gradient-to-br from-neutral-800 to-neutral-900
                      border-4 border-neutral-600 shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
      >
        {/* Optional screw/bolt corners for realism */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gray-400 border border-gray-700 shadow-inner" />
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gray-400 border border-gray-700 shadow-inner" />
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gray-400 border border-gray-700 shadow-inner" />
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gray-400 border border-gray-700 shadow-inner" />

        <div className="flex flex-col gap-10">
          {/* Lights + Preview */}
          <div className="flex justify-between items-center">
            {/* Lights */}
            <div className="flex gap-3">
              <Light isOn={redOn} color="red" />
              <Light isOn={greenOn} color="green" />
            </div>

            {/* Preview */}
            <div className="flex gap-4 text-gray-200 text-2xl font-mono">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="relative w-5 flex justify-center">
                  {entered[i] && (
                    <span className="absolute -top-1">{entered[i]}</span>
                  )}
                  <span className="text-gray-400">_</span>
                </div>
              ))}
            </div>
          </div>

          {/* Numpad */}
          <div className="flex flex-col gap-4">
            {keypadRows.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-4">
                {row.map((key) => {
                  const isActive = pressedKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleKey(key)}
                      className={`w-20 h-20 text-2xl font-extrabold border-2 border-gray-400 text-gray-200 
              rounded-md transition-transform flex items-center justify-center
              bg-neutral-800/70
              ${isActive ? "bg-gray-500 scale-95" : ""}
              active:scale-95`}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Backspace row */}
            <div className="flex gap-4">
              <div className="w-20 h-20" /> {/* Spacer under * */}
              <div className="w-20 h-20" /> {/* Spacer under 0 */}
              <button
                onClick={() => handleKey("←")}
                className={`w-20 h-20 text-2xl font-extrabold border-2 border-gray-400 text-gray-200 
             rounded-md transition-all flex items-center justify-center
             bg-neutral-800/70
            active:scale-95`}
              >
                ←
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

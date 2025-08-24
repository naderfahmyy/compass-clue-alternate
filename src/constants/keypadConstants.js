export const UNLOCK_CODE = "5973";
export const SEQUENCE_CODE = "4197";

// Keypad layout
export const KEYPAD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

// Sequence light timings
export const SEQUENCE_TIMING = {
  FLASH_DURATION: 200, // how long a light stays ON
  FLASH_INTERVAL: 400, // gap between flashes of one digit
  DIGIT_PAUSE: 550, // pause between different digits
  RESTART_DELAY: 1000, // how long to wait before restarting after wrong sequence
  SEQUENCE_START_DELAY: 1000, // delay before starting sequence after unlock
};

// Other UI delays
export const UI_TIMING = {
  RED_FLASH: 400, // red light flash duration
  CLEAR_PREVIEW: 600, // how long the typed code shows before clearing
};

const PROBABILITY_LEVELS = {
  high: { tone: "green" },
  medium: { tone: "yellow" },
  low: { tone: "orange" },
  veryLow: { tone: "red" },
};

export const getProbabilityTone = (probability = 0) => {
  if (probability >= 75) return PROBABILITY_LEVELS.high;
  if (probability >= 50) return PROBABILITY_LEVELS.medium;
  if (probability >= 25) return PROBABILITY_LEVELS.low;
  return PROBABILITY_LEVELS.veryLow;
};

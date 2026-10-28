import confetti from 'canvas-confetti';

export const triggerApprovalConfetti = () => {
  try {
    // Left burst
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: ['#00875A', '#36B37E', '#0052CC', '#FFAB00']
    });

    // Right burst
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: ['#00875A', '#36B37E', '#0052CC', '#6554C0']
    });
  } catch (err) {
    console.warn("Confetti animation skipped:", err);
  }
};

"use strict";

(() => {
  const variant = new URLSearchParams(window.location.search).get("headset") === "b" ? "b" : "a";

  document.querySelectorAll(".prop-headset").forEach(canvas => {
    const context = pixelContext(canvas);
    const rarity = Number(canvas.dataset.equipmentRarity || 0);
    const accent = EQUIPMENT_RARITIES[Math.max(0, Math.min(EQUIPMENT_RARITIES.length - 1, rarity))].color;
    const pixel = (color, x, y, width, height) => {
      context.fillStyle = color;
      context.fillRect(x, y, width, height);
    };

    if (variant === "b") {
      pixel(COLORS.ink, 9, 2, 7, 2);
      pixel(COLORS.ink, 7, 3, 3, 2);
      pixel(COLORS.ink, 6, 5, 2, 7);
      pixel(COLORS.ink, 16, 3, 2, 9);
      pixel(accent, 15, 9, 4, 6);
      pixel(COLORS.paper, 16, 10, 2, 3);
      pixel(COLORS.ink, 17, 14, 2, 2);
      pixel(COLORS.ink, 14, 15, 4, 1);
      pixel(COLORS.ink, 12, 16, 3, 2);
      pixel(accent, 11, 16, 2, 2);
      return;
    }

    pixel(COLORS.ink, 8, 2, 8, 2);
    pixel(COLORS.ink, 6, 3, 3, 2);
    pixel(COLORS.ink, 15, 3, 3, 2);
    pixel(COLORS.ink, 5, 5, 2, 8);
    pixel(COLORS.ink, 17, 5, 2, 8);
    pixel(COLORS.ink, 3, 10, 4, 7);
    pixel(COLORS.ink, 17, 10, 4, 7);
    pixel(accent, 4, 11, 3, 5);
    pixel(accent, 17, 11, 3, 5);
    pixel(COLORS.paper, 5, 12, 2, 3);
    pixel(COLORS.paper, 17, 12, 2, 3);
    pixel(COLORS.ink, 18, 16, 2, 2);
    pixel(COLORS.ink, 15, 17, 4, 1);
    pixel(accent, 14, 17, 2, 2);
  });
})();

"use strict";

(function attachEquipmentSort(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.OfficeRaidEquipmentSort = api;
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  const SLOT_ORDER = { work: 0, support: 1, personal: 2 };

  function acquisitionOrder(item, index) {
    const match = String(item?.id || "").match(/(\d+)$/);
    return match ? Number(match[1]) : index;
  }

  function totalBonus(item) {
    return Number(item?.workBonus || 0) + Number(item?.collaborationBonus || 0);
  }

  function sortEquipment(items, mode = "newest") {
    const entries = (Array.isArray(items) ? items : []).map((item, index) => ({
      item,
      index,
      acquired: acquisitionOrder(item, index)
    }));

    entries.sort((left, right) => {
      const latest = right.acquired - left.acquired || right.index - left.index;
      const rarity = Number(right.item?.rarity || 0) - Number(left.item?.rarity || 0);
      const stats = totalBonus(right.item) - totalBonus(left.item);

      if (mode === "rarity") return rarity || stats || latest;
      if (mode === "stats") return stats || rarity || latest;
      if (mode === "slot") {
        const slot = (SLOT_ORDER[left.item?.slot] ?? 99) - (SLOT_ORDER[right.item?.slot] ?? 99);
        return slot || rarity || stats || latest;
      }
      return latest;
    });

    return entries.map(entry => entry.item);
  }

  return { sortEquipment };
});

(function (global, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (global) global.OfficeRaidManagement = api;
})(typeof window !== "undefined" ? window : globalThis, function createOfficeRaidManagement() {
  "use strict";

  const OFFICE_PAGE_SIZE = 6;
  const EXECUTIVE_PAGE_STAFF_SIZE = 5;
  const HR_SORT_KEYS = ["rank", "joined", "department", "participation"];

  function hasExecutiveSeat(companyLevel = 0) {
    return Math.max(0, Number(companyLevel) || 0) >= 1;
  }

  function generalSeatCapacity(capacity = OFFICE_PAGE_SIZE, companyLevel = 0) {
    return Math.max(0, Math.round(Number(capacity) || 0) - (hasExecutiveSeat(companyLevel) ? 1 : 0));
  }

  function normalizeOfficeSeats(employees = [], savedSeats = [], capacity = OFFICE_PAGE_SIZE, companyLevel = 0) {
    const executive = hasExecutiveSeat(companyLevel);
    const eligible = employees.filter(member => member && (!executive || !member.isRepresentative));
    const eligibleIds = new Set(eligible.map(member => member.id));
    const seatCount = generalSeatCapacity(capacity, companyLevel);
    const result = Array.from({ length: seatCount }, () => null);
    const used = new Set();
    (Array.isArray(savedSeats) ? savedSeats : []).slice(0, seatCount).forEach((id, index) => {
      if (typeof id !== "string" || !eligibleIds.has(id) || used.has(id)) return;
      result[index] = id;
      used.add(id);
    });
    eligible.forEach(member => {
      if (used.has(member.id)) return;
      const openIndex = result.indexOf(null);
      if (openIndex >= 0) result[openIndex] = member.id;
      used.add(member.id);
    });
    return result;
  }

  function officeSeatIndicesForPage(page = 0, companyLevel = 0) {
    const safePage = Math.max(0, Math.round(Number(page) || 0));
    if (!hasExecutiveSeat(companyLevel)) {
      return Array.from({ length: OFFICE_PAGE_SIZE }, (_, index) => safePage * OFFICE_PAGE_SIZE + index);
    }
    if (safePage === 0) return Array.from({ length: EXECUTIVE_PAGE_STAFF_SIZE }, (_, index) => index);
    const start = EXECUTIVE_PAGE_STAFF_SIZE + (safePage - 1) * OFFICE_PAGE_SIZE;
    return Array.from({ length: OFFICE_PAGE_SIZE }, (_, index) => start + index);
  }

  function maximumOfficePages(capacity = OFFICE_PAGE_SIZE, companyLevel = 0) {
    const seats = generalSeatCapacity(capacity, companyLevel);
    if (!hasExecutiveSeat(companyLevel)) return Math.max(1, Math.ceil(seats / OFFICE_PAGE_SIZE));
    return Math.max(1, 1 + Math.ceil(Math.max(0, seats - EXECUTIVE_PAGE_STAFF_SIZE) / OFFICE_PAGE_SIZE));
  }

  function occupiedOfficePages(seats = [], companyLevel = 0) {
    let highest = -1;
    seats.forEach((id, index) => { if (id) highest = index; });
    if (highest < 0 || !hasExecutiveSeat(companyLevel) || highest < EXECUTIVE_PAGE_STAFF_SIZE) return 1;
    return 1 + Math.ceil((highest - EXECUTIVE_PAGE_STAFF_SIZE + 1) / OFFICE_PAGE_SIZE);
  }

  function sortEmployees(employees = [], sortKey = "rank", departmentOrder = []) {
    const key = HR_SORT_KEYS.includes(sortKey) ? sortKey : "rank";
    const departments = new Map(departmentOrder.map((id, index) => [id, index]));
    const indexed = employees.map((member, index) => ({ member, index }));
    return indexed.sort((leftItem, rightItem) => {
      const left = leftItem.member;
      const right = rightItem.member;
      if (left.isRepresentative !== right.isRepresentative) return left.isRepresentative ? -1 : 1;
      let compared = 0;
      if (key === "rank") compared = (Number(right.rank) || 0) - (Number(left.rank) || 0);
      if (key === "joined") compared = (Number(left.joinOrder) || leftItem.index + 1) - (Number(right.joinOrder) || rightItem.index + 1);
      if (key === "department") {
        compared = (departments.get(left.department) ?? 999) - (departments.get(right.department) ?? 999);
        if (!compared) compared = (Number(right.rank) || 0) - (Number(left.rank) || 0);
      }
      if (key === "participation") compared = (Number(right.projectParticipation) || 0) - (Number(left.projectParticipation) || 0);
      if (!compared && key !== "rank") compared = (Number(right.rank) || 0) - (Number(left.rank) || 0);
      if (!compared) compared = (Number(left.joinOrder) || leftItem.index + 1) - (Number(right.joinOrder) || rightItem.index + 1);
      return compared || leftItem.index - rightItem.index;
    }).map(item => item.member);
  }

  return {
    OFFICE_PAGE_SIZE,
    EXECUTIVE_PAGE_STAFF_SIZE,
    HR_SORT_KEYS,
    hasExecutiveSeat,
    generalSeatCapacity,
    normalizeOfficeSeats,
    officeSeatIndicesForPage,
    maximumOfficePages,
    occupiedOfficePages,
    sortEmployees
  };
});

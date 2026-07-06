globalThis.process ??= {};
globalThis.process.env ??= {};
function getTierLabel(tier) {
  const labels = {
    1: "Dental Empire C++",
    2: "Dental Empire U++",
    3: "Dental Empire OS"
  };
  return labels[tier] || `Tầng ${tier}`;
}
export {
  getTierLabel as g
};

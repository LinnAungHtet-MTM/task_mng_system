const statusItem = [
  { key: 0, value: "Opened" },
  { key: 1, value: "In progress" },
  { key: 2, value: "Finished" },
  { key: 3, value: "Closed" },
  { key: 4, value: "All" },
];

export const statusOption = statusItem.map((item) => ({
  value: item.key,
  label: item.value,
}));

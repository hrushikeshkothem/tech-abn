// utils/isElectron.ts
//export const isElectron = () => typeof window !== "undefined" && typeof window.process === "object" && window.process.type === "renderer";
export const isElectron = () => true;
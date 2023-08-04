export function isTestMode() {
  return process.env.NODE_ENV === "test";
}

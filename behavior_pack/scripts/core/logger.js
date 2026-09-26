export function createLogger(scope) {
  return {
    info(message) {
      console.warn("[Tsunami Physics][" + scope + "] " + message);
    },
    warn(message) {
      console.warn("[Tsunami Physics][" + scope + "][WARN] " + message);
    }
  };
}

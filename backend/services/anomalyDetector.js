function detectAnomaly(log) {
  let score = 0;
  let reason = [];

  if (log.status >= 500) {
    score += 0.5;
    reason.push("Server error");
  }

  if (log.status === 403) {
    score += 0.3;
    reason.push("Access denied");
  }

  if (log.status === 404) {
    score += 0.2;
    reason.push("Resource not found");
  }

  if (log.severity === "ERROR") {
    score += 0.3;
    reason.push("Error severity");
  }

  return {
    isAnomaly: score >= 0.5,
    score,
    reason: reason.join(", "),
  };
}

module.exports = {
  detectAnomaly,
};
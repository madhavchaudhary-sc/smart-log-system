function StatsCards({ logs }) {
  const total = logs.length;
  const anomalies = logs.filter((log) => log.isAnomaly).length;
  const normal = logs.filter((log) => !log.isAnomaly).length;
  const critical = logs.filter(
    (log) => log.severity === "CRITICAL"
  ).length;

  return (
    <div>
      <p>Total Logs: {total}</p>
      <p>Anomalies: {anomalies}</p>
      <p>Normal: {normal}</p>
      <p>Critical: {critical}</p>
    </div>
  );
}

export default StatsCards;
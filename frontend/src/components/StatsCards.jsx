function StatsCards({ logs }) {
  const total = logs.length;
  const anomalies = logs.filter((log) => log.isAnomaly).length;
  const normal = logs.filter((log) => !log.isAnomaly).length;
  const critical = logs.filter(
    (log) => log.severity === "CRITICAL"
  ).length;

  const stats = [
    { label: "Total Logs", value: total, tone: "total" },
    { label: "Anomalies", value: anomalies, tone: "anomaly" },
    { label: "Normal", value: normal, tone: "normal" },
    { label: "Critical", value: critical, tone: "critical" },
  ];

  return (
    <div className="stats-grid">
      {stats.map(({ label, value, tone }) => (
        <div key={label} className={`stat-card ${tone}`}>
          <span className="stat-label">{label}</span>
          <strong className="stat-value">{value}</strong>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
function StatsCards({ stats }) {
  const cards = [
    {
      label: "Total Logs",
      value: stats.total,
      tone: "total",
    },
    {
      label: "Anomalies",
      value: stats.anomalies,
      tone: "anomaly",
    },
    {
      label: "Normal",
      value: stats.normal,
      tone: "normal",
    },
    {
      label: "Critical",
      value: stats.critical,
      tone: "critical",
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map(({ label, value, tone }) => (
        <div key={label} className={`stat-card ${tone}`}>
          <span className="stat-label">{label}</span>
          <strong className="stat-value">{value}</strong>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
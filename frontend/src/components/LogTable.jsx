function LogTable({ logs, onSelectLog }) {
  return (
    <div className="table-wrap">
      <table className="log-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Source</th>
            <th>Event</th>
            <th>Status</th>
            <th>Severity</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => {
            const severity = (log.severity || "info").toLowerCase();

            return (
              <tr
                key={log._id}
                onClick={() => onSelectLog(log)}
                className={log.isAnomaly ? "log-row anomaly-row" : "log-row"}
                style={{ cursor: "pointer" }}
              >
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.source}</td>
                <td>{log.eventType}</td>
                <td>
                  <span className={`status-badge ${log.status?.toLowerCase?.() || "info"}`}>
                    {log.status}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${severity}`}>
                    {log.severity}
                  </span>
                </td>
                <td>{log.anomalyScore}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LogTable;
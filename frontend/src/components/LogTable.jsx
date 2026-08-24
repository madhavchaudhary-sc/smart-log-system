function LogTable({ logs, onSelectLog }) {
  return (
    <table>
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
        {logs.map((log) => (
          <tr
            key={log._id}
            onClick={() => onSelectLog(log)}
            style={{
              cursor: "pointer",
              backgroundColor: log.isAnomaly ? "#ffe0e0" : "white",
            }}
          >
            <td>{new Date(log.timestamp).toLocaleString()}</td>
            <td>{log.source}</td>
            <td>{log.eventType}</td>
            <td>{log.status}</td>
            <td>{log.severity}</td>
            <td>{log.anomalyScore}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LogTable;